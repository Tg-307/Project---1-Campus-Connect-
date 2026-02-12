from django.contrib import admin

# Register your models here.

from .models import Institute, Profile
admin.site.register(Institute)
admin.site.register(Profile)
