from rest_framework.generics import GenericAPIView
from rest_framework import permissions, status, generics
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, MeSerializer, LogoutSerializer, InstituteSerializer

from .models import Institute

class InstituteListAPIView(generics.ListAPIView):
    queryset = Institute.objects.all().order_by("name")
    serializer_class = InstituteSerializer
    permission_classes = [permissions.AllowAny]

class RegisterAPIView(GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(serializer.to_representation(user), status=status.HTTP_201_CREATED)


class MeAPIView(GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MeSerializer

    def get(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LogoutAPIView(GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LogoutSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            token = RefreshToken(serializer.validated_data["refresh"])
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)


