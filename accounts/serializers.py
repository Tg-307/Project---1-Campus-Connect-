from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Institute, Profile


class InstituteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institute
        fields = ["id", "name", "code"]


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField(required=False, allow_blank=True)

    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True, min_length=6)


    # Multi-tenant fields
    institute_code = serializers.CharField()
    role = serializers.ChoiceField(choices=Profile.ROLE_CHOICES)

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return data

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_institute_code(self, value):
        if not Institute.objects.filter(code=value).exists():
            raise serializers.ValidationError("Invalid institute code")
        return value

    def create(self, validated_data):
        institute = Institute.objects.get(code=validated_data["institute_code"])

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )

        Profile.objects.create(
            user=user,
            institute=institute,
            role=validated_data["role"]
        )

        return user

    def to_representation(self, instance):
        refresh = RefreshToken.for_user(instance)
        return {
            "message": "User registered successfully",
            "user": {
                "id": instance.id,
                "username": instance.username,
                "email": instance.email,
                "role": instance.profile.role,
                "institute": {
                    "id": instance.profile.institute.id,
                    "name": instance.profile.institute.name,
                    "code": instance.profile.institute.code,
                }
            },
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class MeSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source="profile.role", read_only=True)
    institute = InstituteSerializer(source="profile.institute", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "date_joined", "role", "institute"]

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()