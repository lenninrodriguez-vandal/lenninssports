from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.postgres.fields import ArrayField

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    favorite_team_ids = ArrayField(models.IntegerField(), default=list, blank=True)

    def __str__(self):
        return self.username