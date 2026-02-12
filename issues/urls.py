from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import IssueViewSet

router = DefaultRouter()
router.register("issues", IssueViewSet, basename="issues")

urlpatterns = [
    path("", include(router.urls)),
]
