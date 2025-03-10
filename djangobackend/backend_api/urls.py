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
    path('register/', views.RegisterUserView.as_view()),
    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('me/', views.UserDetailView.as_view()),
    path('update_favorites/', views.UpdateFavoriteTeamsView.as_view())
]