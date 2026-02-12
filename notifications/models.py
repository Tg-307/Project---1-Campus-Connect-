from django.db import models
from django.contrib.auth.models import User
from accounts.models import Institute


class Notification(models.Model):
    institute = models.ForeignKey(Institute, on_delete=models.CASCADE, related_name="notifications")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")

    title = models.CharField(max_length=200)
    message = models.TextField()

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Notif({self.user.username}) - {self.title}"
