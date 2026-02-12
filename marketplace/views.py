from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from drf_spectacular.utils import extend_schema



from .models import Category, Listing, ListingImage
from .serializers import CategorySerializer, ListingSerializer, ListingImageSerializer
from .permissions import IsOwnerOrReadOnly


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        institute = self.request.user.profile.institute
        return Category.objects.filter(institute=institute).order_by("name")

    def perform_create(self, serializer):
        institute = self.request.user.profile.institute
        serializer.save(institute=institute)


class ListingViewSet(viewsets.ModelViewSet):
    serializer_class = ListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    # ✅ Search + Filter + Ordering
    search_fields = ["title", "description"]
    ordering_fields = ["price", "created_at", "title"]
    ordering = ["-created_at"]
    filterset_fields = ["status", "price"]

    def get_queryset(self):
        institute = self.request.user.profile.institute
        return Listing.objects.filter(institute=institute).select_related("owner", "category").prefetch_related("images")

    def perform_create(self, serializer):
        institute = self.request.user.profile.institute
        category_id = self.request.data.get("category_id")

        category = None
        if category_id:
            category = Category.objects.filter(id=category_id, institute=institute).first()

        serializer.save(owner=self.request.user, institute=institute, category=category)

    @extend_schema(
    request=ListingImageSerializer,
    responses={201: ListingImageSerializer},
    )
    @action(
        detail=True,
        methods=["POST"],
        permission_classes=[permissions.IsAuthenticated],
        parser_classes=[MultiPartParser, FormParser],
    )
    def upload_image(self, request, pk=None):
        listing = self.get_object()

        if listing.owner != request.user:
            return Response({"error": "Only owner can upload images"}, status=status.HTTP_403_FORBIDDEN)

        serializer = ListingImageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(listing=listing)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
