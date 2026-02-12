from .models import Notification


def create_notification(institute, user, title, message):
    Notification.objects.create(
        institute=institute,
        user=user,
        title=title,
        message=message,
    )
