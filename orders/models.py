from django.db import models
from django.contrib.auth.models import User
from accounts.models import Institute
from marketplace.models import Listing


class Order(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("ACCEPTED", "Accepted"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled"),
        ("REJECTED", "Rejected"),
    ]

    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name="orders")

    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="orders")

    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders_bought")
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders_sold")

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order#{self.id} {self.listing.title} ({self.status})"
