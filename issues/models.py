from django.db import models
from django.contrib.auth.models import User
from accounts.models import Institute


class Issue(models.Model):
    STATUS_CHOICES = [
        ("OPEN", "Open"),
        ("IN_PROGRESS", "In Progress"),
        ("RESOLVED", "Resolved"),
    ]

    PRIORITY_CHOICES = [
        ("LOW", "Low"),
        ("MEDIUM", "Medium"),
        ("HIGH", "High"),
    ]

    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name="issues")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="issues")

    title = models.CharField(max_length=200)
    description = models.TextField()

    category = models.CharField(max_length=100)  # wifi/hostel/mess/lab etc.

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="OPEN")
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="MEDIUM")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.status}) - {self.institute.code}"
