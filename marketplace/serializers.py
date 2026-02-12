from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Listing, ListingImage


class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ["id", "image", "created_at"]


class ListingSerializer(serializers.ModelSerializer):
    owner = UserMiniSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
    images = ListingImageSerializer(many=True, read_only=True)

    class Meta:
        model = Listing
        fields = [
            "id",
            "title",
            "description",
            "price",
            "status",
            "category",
            "category_id",
            "owner",
            "images",
            "created_at",
        ]

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError("Price must be greater than 0")
        return value
