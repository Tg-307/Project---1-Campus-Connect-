from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterAPIView, MeAPIView, LogoutAPIView, InstituteListAPIView

urlpatterns = [
    path("auth/register/", RegisterAPIView.as_view(), name="register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="login"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("auth/logout/", LogoutAPIView.as_view(), name="logout"),
    path("auth/me/", MeAPIView.as_view(), name="me"),
    path("institutes/", InstituteListAPIView.as_view(), name="institutes-list"),
]
