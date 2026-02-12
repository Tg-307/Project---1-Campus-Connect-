from django.db import models
from django.contrib.auth.models import User
from accounts.models import Institute


class Category(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name="categories")
    name = models.CharField(max_length=100)

    class Meta:
        unique_together = ("institute", "name")

    def __str__(self):
        return f"{self.name} ({self.institute.code})"


class Listing(models.Model):
    STATUS_CHOICES = [
        ("AVAILABLE", "Available"),
        ("SOLD", "Sold"),
    ]

    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name="listings")
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="listings")

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.PositiveIntegerField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="AVAILABLE")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.institute.code}"


class ListingImage(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="listings/")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for Listing #{self.listing.id}"
