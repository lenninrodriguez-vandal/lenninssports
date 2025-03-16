from rest_framework import serializers
from django.contrib.auth import get_user_model

CustomUser = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'password',  'email', 'favorite_team_ids']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """Hash password before saving the user"""
        user = CustomUser(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


