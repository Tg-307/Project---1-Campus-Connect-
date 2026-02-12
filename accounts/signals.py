from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Profile, Institute


@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    """
    Profile should be created during register API, because we need institute + role.
    So this signal won't auto-create Profile blindly.
    """
    pass
