from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from notifications.utils import create_notification


from .models import Order
from .serializers import OrderSerializer
from marketplace.models import Listing
from django.db.models import Q


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        institute = self.request.user.profile.institute
        user = self.request.user

        return Order.objects.filter(
            institute=institute
        ).filter(
            Q(buyer=user) | Q(seller=user)
        )


    def create(self, request, *args, **kwargs):
        institute = request.user.profile.institute
        listing_id = request.data.get("listing_id")

        listing = Listing.objects.filter(id=listing_id, institute=institute).first()
        if not listing:
            return Response({"error": "Listing not found in your institute"}, status=status.HTTP_404_NOT_FOUND)

        if listing.owner == request.user:
            return Response({"error": "You cannot buy your own listing"}, status=status.HTTP_400_BAD_REQUEST)

        if listing.status != "AVAILABLE":
            return Response({"error": "Listing is not available"}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ prevent duplicate pending order by same buyer for same listing
        if Order.objects.filter(listing=listing, buyer=request.user, status="PENDING").exists():
            return Response({"error": "You already requested this listing"}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(
            institute=institute,
            listing=listing,
            buyer=request.user,
            seller=listing.owner,
            status="PENDING"
        )
        create_notification(
            institute=order.institute,
            user=order.seller,
            title="New Order Request",
            message=f"{order.buyer.username} requested to buy your item '{order.listing.title}'."
        )


        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["PATCH"])
    def accept(self, request, pk=None):
        order = self.get_object()

        if order.seller != request.user:
            return Response({"error": "Only seller can accept"}, status=status.HTTP_403_FORBIDDEN)

        if order.status != "PENDING":
            return Response({"error": "Only pending orders can be accepted"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = "ACCEPTED"
        order.save()
        create_notification(
        institute=order.institute,
        user=order.buyer,
        title="Order Accepted",
        message=f"Your request for '{order.listing.title}' was accepted by {order.seller.username}."
        )

        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=["PATCH"])
    def reject(self, request, pk=None):
        order = self.get_object()

        if order.seller != request.user:
            return Response({"error": "Only seller can reject"}, status=status.HTTP_403_FORBIDDEN)

        if order.status != "PENDING":
            return Response({"error": "Only pending orders can be rejected"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = "REJECTED"
        order.save()
        create_notification(
        institute=order.institute,
        user=order.buyer,
        title="Order Rejected",
        message=f"Your request for '{order.listing.title}' was rejected by {order.seller.username}."
        )


        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=["PATCH"])
    def complete(self, request, pk=None):
        order = self.get_object()

        if order.seller != request.user:
            return Response({"error": "Only seller can complete"}, status=status.HTTP_403_FORBIDDEN)

        if order.status != "ACCEPTED":
            return Response({"error": "Only accepted orders can be completed"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = "COMPLETED"
        order.save()
        create_notification(
        institute=order.institute,
        user=order.buyer,
        title="Order Completed",
        message=f"Your order for '{order.listing.title}' is marked completed."      
        )


        # mark listing sold
        order.listing.status = "SOLD"
        order.listing.save()

        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=["PATCH"])
    def cancel(self, request, pk=None):
        order = self.get_object()

        if order.buyer != request.user:
            return Response({"error": "Only buyer can cancel"}, status=status.HTTP_403_FORBIDDEN)

        if order.status != "PENDING":
            return Response({"error": "Only pending orders can be cancelled"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = "CANCELLED"
        order.save()
        create_notification(
        institute=order.institute,
        user=order.seller,
        title="Order Cancelled",
        message=f"The buyer cancelled the order request for '{order.listing.title}'."
        )


        return Response(OrderSerializer(order).data)
