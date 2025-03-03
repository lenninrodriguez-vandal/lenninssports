from django.urls import path
from . import views

urlpatterns = [
    path('team_details', views.team_details, name='team_details'),
    path('upcoming_games', views.upcoming_games, name='upcoming_games'),
    path('past_games', views.past_games, name='past_games'),
    path('live_games', views.live_games, name='live_games'),
    path('players_by_team', views.players_by_team, name='players_by_team')
]