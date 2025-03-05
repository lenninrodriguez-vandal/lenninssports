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