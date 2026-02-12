from django.db import models
from django.contrib.auth.models import User


class Institute(models.Model):
    name = models.CharField(max_length=200, unique=True)
    code = models.CharField(max_length=50, unique=True)  # example: IIITG
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.name}"


class Profile(models.Model):
    ROLE_CHOICES = [
        ("STUDENT", "Student"),
        ("FACULTY", "Faculty"),
        ("STAFF", "Staff"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name="members")
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} ({self.role}) - {self.institute.code}"
