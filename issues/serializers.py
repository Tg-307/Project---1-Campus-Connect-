from rest_framework import serializers
from .models import Issue


# =========================
# READ SERIALIZER
# =========================
class IssueReadSerializer(serializers.ModelSerializer):
    # ADD THIS - Show who created the issue
    created_by = serializers.SerializerMethodField()
    
    class Meta:
        model = Issue
        fields = [
            "id", "title", "description", "category",
            "status", "priority", "created_at",
            "created_by",  # <-- Add this
        ]
    
    def get_created_by(self, obj):
        return {
            'id': obj.created_by.id,
            'username': obj.created_by.username,
            'first_name': obj.created_by.first_name,
            'last_name': obj.created_by.last_name,
        }

# =========================
# CREATE SERIALIZER
# =========================
class IssueCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = [
            "title",
            "description",
            "category",
        ]

    def create(self, validated_data):
        """
        Enforce multi-tenant safety:
        - institute comes from request.user
        - created_by comes from request.user
        """
        request = self.context["request"]
        user = request.user

        return Issue.objects.create(
            title=validated_data["title"],
            description=validated_data["description"],
            category=validated_data["category"],
            created_by=user,
            institute=user.profile.institute,
        )


# =========================
# ADMIN / STAFF UPDATE SERIALIZER
# =========================
class IssueAdminUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ["status", "priority"]
