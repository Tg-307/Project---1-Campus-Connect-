from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response


from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        institute = self.request.user.profile.institute
        return Notification.objects.filter(institute=institute, user=self.request.user)

    @action(detail=True, methods=["PATCH"])
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        notif.is_read = True
        notif.save()
        return Response(NotificationSerializer(notif).data, status=status.HTTP_200_OK)

    @action(detail=False, methods=["PATCH"])
    def mark_all_read(self, request):
        qs = self.get_queryset().filter(is_read=False)
        qs.update(is_read=True)
        return Response({"message": "All notifications marked as read"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=["GET"])
    def unread_count(self, request):
        qs = self.get_queryset().filter(is_read=False)
        return Response({"unread_count": qs.count()}, status=status.HTTP_200_OK)

