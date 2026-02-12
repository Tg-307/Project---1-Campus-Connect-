from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .permissions import IsIssueOwnerOrReadOnly, IsFacultyOrStaff


from .models import Issue
from .serializers import (
    IssueReadSerializer,
    IssueCreateSerializer,
    IssueAdminUpdateSerializer,
)

from notifications.utils import create_notification


class IssueViewSet(viewsets.ModelViewSet):

    def get_permissions(self):
    # Everyone must be authenticated
        if self.action in ["list", "retrieve", "create"]:
            return [
                permissions.IsAuthenticated(),
                IsIssueOwnerOrReadOnly(),
            ]

        # Faculty/Staff-only actions
        if self.action in ["update", "partial_update", "admin_update"]:
            return [
                permissions.IsAuthenticated(),
                IsFacultyOrStaff(),
            ]

        return [permissions.IsAuthenticated()]



    permission_classes = [permissions.IsAuthenticated]

    search_fields = ["title", "description", "category"]
    ordering_fields = ["created_at", "priority", "status"]
    ordering = ["-created_at"]
    filterset_fields = ["status", "priority", "category"]

    # 🔐 institute isolation
    def get_queryset(self):
        return Issue.objects.filter(
            institute=self.request.user.profile.institute
        )

    # 🔁 serializer switching
    def get_serializer_class(self):
        if self.action == "create":
            return IssueCreateSerializer

        if self.action in ["update", "partial_update", "admin_update"]:
            return IssueAdminUpdateSerializer

        return IssueReadSerializer

    # 🏗️ safe creation
    def perform_create(self, serializer):
        serializer.save(
            created_by=self.request.user,
            institute=self.request.user.profile.institute,
        )

    # 👮 role-based admin update
    @action(detail=True, methods=["PATCH"])
    def admin_update(self, request, pk=None):
        issue = self.get_object()

        # role check (NOT Django admin)
        if request.user.profile.role not in ["FACULTY", "STAFF"]:
            return Response(
                {"detail": "Not authorized"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = IssueAdminUpdateSerializer(
            issue, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        create_notification(
            institute=issue.institute,
            user=issue.created_by,
            title="Issue Updated",
            message=f"Your issue '{issue.title}' status is now {issue.status}.",
        )

        return Response(IssueReadSerializer(issue).data)
