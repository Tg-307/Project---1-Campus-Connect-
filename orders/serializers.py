from rest_framework import serializers
from .models import Order
from marketplace.models import Listing


from marketplace.serializers import ListingSerializer

class OrderSerializer(serializers.ModelSerializer):
    buyer_username = serializers.ReadOnlyField(source="buyer.username")
    seller_username = serializers.ReadOnlyField(source="seller.username")
    listing_title = serializers.ReadOnlyField(source="listing.title")
    
    # ADD THIS - Full listing with images and price
    listing = ListingSerializer(read_only=True)
    
    listing_id = serializers.IntegerField(write_only=True)
    
    # ADD THIS - Buyer/Seller IDs for frontend
    buyer = serializers.SerializerMethodField()
    seller = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id", "listing_id", "listing",  # <-- Add "listing" here
            "listing_title", "buyer", "buyer_username",
            "seller", "seller_username", "status", "created_at",
        ]
    
    def get_buyer(self, obj):
        return {'id': obj.buyer.id, 'username': obj.buyer.username}
    
    def get_seller(self, obj):
        return {'id': obj.seller.id, 'username': obj.seller.username}