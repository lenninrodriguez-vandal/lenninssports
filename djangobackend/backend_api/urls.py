from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('team_details', views.team_details, name='team_details'),
    path('upcoming_games', views.upcoming_games, name='upcoming_games'),
    path('past_games', views.past_games, name='past_games'),
    path('live_games', views.live_games, name='live_games'),
    path('players_by_team', views.players_by_team, name='players_by_team'),
    path('sports', views.sports, name='sports'),
    path('countries', views.countries, name='countries'),
    path('leagues_by_country', views.leagues_by_country, name='leagues_by_country'),
    path('teams_by_league', views.teams_by_league, name='teams_by_league'),
    path('register/', views.RegisterUserView.as_view(), name='register'),
    path('token/', views.CookieTokenObtainPairView.as_view(), name='token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('me/', views.UserDetailView.as_view(), name='me'),
    path('update_favorites/', views.UpdateFavoriteTeamsView.as_view(), name='update_favorites')
]