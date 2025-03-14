from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model, authenticate
from .serializers import CustomUserSerializer
from rest_framework.permissions import IsAuthenticated

from bs4 import BeautifulSoup
from django.http import JsonResponse
from django.conf import settings
from django.core.cache import cache
import requests


BASE_SPORT_DB_URL = f"https://www.thesportsdb.com/api/v1/json/{settings.SPORT_DB_API_KEY}/"
BASE_SPORT_DB_V2_URL = f"https://www.thesportsdb.com/api/v2/json/"
SECOND = 1
MINUTE = 60 * SECOND
HOUR = 60 * MINUTE

CustomUser = get_user_model()

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            # Try to get the raw token from cookies
            raw_token = request.COOKIES.get("access_token")
        else:
            raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None
        try:
            validated_token = self.get_validated_token(raw_token)
        except Exception as e:
            raise AuthenticationFailed("Invalid token", code="token_not_valid")
        return self.get_user(validated_token), validated_token


# User Sign Up
class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

class UserDetailView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)
    
class UpdateFavoriteTeamsView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        favorite_team_ids = request.data.get("favorite_team_ids", [])

        if len(favorite_team_ids) > 10:
            return JsonResponse({"error": "You can only select up to 10 teams!"}, status=400)

        if not isinstance(favorite_team_ids, list):
            return Response({"error": "favorite_team_ids must be a list of integers"}, status=status.HTTP_400_BAD_REQUEST)

        user.favorite_team_ids = favorite_team_ids
        user.save()

        return Response(CustomUserSerializer(user).data, status=status.HTTP_200_OK)

class CookieTokenObtainPairView(APIView):
    """
    Custom login view that sets JWT tokens in HttpOnly cookies.
    """

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            response = Response({"message": "Login successful"}, status=status.HTTP_200_OK)

            # Set access token in HttpOnly cookie
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,  # Use True if HTTPS is enabled
                samesite="None",
                max_age=900,  # 15 minutes
            )

            # Optionally set refresh token in HttpOnly cookie
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=True,
                samesite="None",
                max_age=604800,  # 7 days
            )

            return response
        else:
            return Response({"error": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)
        
class LogoutView(APIView):
    """
    Logout view that clears JWT cookies.
    """

    def post(self, request):
        response = Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

        # Expire cookies by setting them to empty values and max_age=0
        response.set_cookie("access_token", "", max_age=0, httponly=True, samesite="None", secure=True)
        response.set_cookie("refresh_token", "", max_age=0, httponly=True, samesite="None", secure=True)

        return response

@api_view(["GET"])
def team_details(request):
    team_id = request.GET.get("team_id")

    if not team_id:
        return JsonResponse({"error": "required team_id parameter not found in request!"}, status=400)
    
    cache_key = f"team_details_{team_id}"
    data = cache.get(cache_key)

    if not data:
        url = f"lookupteam.php?id={team_id}"
        response = requests.get(BASE_SPORT_DB_URL + url)
        if response.status_code == 200:
            data = response.json()
            cache.set(cache_key, data, timeout=12 * HOUR)
        else:
            return JsonResponse({"error": f"Failed to retrieve team_details from {url} with team_id: {team_id}"}, status=response.status_code)

    return JsonResponse(data)

@api_view(["GET"])
def upcoming_games(request):
    team_id = request.GET.get("team_id")

    if not team_id:
        return JsonResponse({"error": "required team_id parameter not found in request!"}, status=400)
    
    cache_key = f"upcoming_{team_id}"
    data = cache.get(cache_key)

    if not data:
        url = f"eventsnext.php?id={team_id}"
        response = requests.get(BASE_SPORT_DB_URL + url)
        if response.status_code ==200:
            data = response.json()
            cache.set(cache_key, data, timeout=2 * MINUTE)
        else:
            return JsonResponse({"error": f"Failed to retrieve upcoming_games from {url} with team_id: {team_id}"}, status=response.status_code)
        
    return JsonResponse(data)
    
@api_view(["GET"])
def past_games(request):
    team_id = request.GET.get("team_id")

    if not team_id:
        return JsonResponse({"error": "required team_id parameter not found in request!"}, status=400)
    
    cache_key = f"past_{team_id}"
    data = cache.get(cache_key)

    if not data:
        url = f"eventslast.php?id={team_id}"
        response = requests.get(BASE_SPORT_DB_URL + url)
        if response.status_code == 200:
            data = response.json()
            cache.set(cache_key, data, timeout=2 * MINUTE)
        else:
            return JsonResponse({"error": f"Failed to retrieve past_games from {url} with team_id: {team_id}"}, status=response.status_code)
        
    return JsonResponse(data)

@api_view(["GET"])
def live_games(request):
    headers = {
         'X-API-KEY': settings.SPORT_DB_API_KEY
    }

    cache_key = "live_games"
    data = cache.get(cache_key)

    if not data:
        url = "livescore/all"
        response = requests.get(BASE_SPORT_DB_V2_URL + url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            cache.set(cache_key, data, timeout=30 * SECOND)
        else:
            return JsonResponse({"error": f"Failed to retrieve live_games"}, status=response.status_code)

    return JsonResponse(data)

@api_view(["GET"])
def sports(request):
    supported_sports = [
        "American Football",
        "Baseball",
        "Basketball",
        "Ice Hockey",
        "Rugby",
        "Soccer"
    ]

    return JsonResponse({"sports": supported_sports})

@api_view(["GET"])
def players_by_team(request):
    team_id = request.GET.get("team_id")

    if not team_id:
        return JsonResponse({"error": "required team_id parameter not found in request!"}, status=400)
    
    cache_key = f"players_by_team_{team_id}"
    data = cache.get(cache_key)

    if not data:
        url = f"lookup_all_players.php?id={team_id}"
        response = requests.get(BASE_SPORT_DB_URL + url)
        if response.status_code == 200:
            data = response.json()
            cache.set(cache_key, data, timeout=HOUR * 24)
        else:
            return JsonResponse({"error": f"Failed to retrieve players with url: {url}"})
        
    return JsonResponse(data)

@api_view(["GET"])
def countries(request):

    cache_key = "countries"
    data = cache.get(cache_key)

    if not data:
        url  = "all_countries.php"
        response = requests.get(BASE_SPORT_DB_URL + url)
        if response.status_code == 200:
            data = response.json()
            cache.set(cache_key, data, timeout =HOUR * 24)
        else:
            return JsonResponse({"error": f"Failed to retrieve countries with url: {url}"})
        
    return JsonResponse(data)

@api_view(["GET"])
def leagues_by_country(request):
    country = request.GET.get("country")
    sport = request.GET.get("sport")

    if not country or not sport:
        return JsonResponse({"error": "Missing a country or a sport parameter in the request!"}, status=400)

    cache_key = f"leagues_{country}_{sport}"
    data = cache.get(cache_key)

    if not data:
        url = f"search_all_leagues.php?c={country}&s={sport}"
        response = requests.get(BASE_SPORT_DB_URL + url)
        if response.status_code == 200:
            data = response.json()
            cache.set(cache_key, data, timeout=HOUR * 24)
        else:
            return JsonResponse({"error": f"Failed to retrieve leagues by country with url: {url}"})

    return JsonResponse(data)

@api_view(["GET"])
def teams_by_league(request):
    league_id = request.GET.get("league_id")

    if not league_id:
        return JsonResponse({"error": "No league_id found in request!"}, status=400)
    
    cache_key = f"teams_by_league_{league_id}"
    data = cache.get(cache_key)

    if not data:
        url = f"lookup_all_teams.php?id={league_id}"
        response = requests.get(BASE_SPORT_DB_URL + url)
        if response.status_code == 200:
            data = response.json()
            cache.set(cache_key, data, timeout=HOUR * 24)
        else:
            return JsonResponse({"error": f"Failed to retrieve teams by league with url: {url}"})
        
    return JsonResponse(data)