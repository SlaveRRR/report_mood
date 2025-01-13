from rest_framework import serializers

from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    username = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password']


class GetTokenSerializer(serializers.Serializer):
    username = serializers.CharField(label='Username', required=True)
    password = serializers.CharField(label='Password', required=True)


class UserListSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = CustomUser(**validated_data)

        user.set_password(validated_data["password"])
        user.save()

        return user

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "username",
            "role",
            "email",
        ]

