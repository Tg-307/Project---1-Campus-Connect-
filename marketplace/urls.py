from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import CategoryViewSet, ListingViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="categories")
router.register("listings", ListingViewSet, basename="listings")

urlpatterns = [
    path("", include(router.urls)),
]
