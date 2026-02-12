from django.contrib import admin

# Register your models here.

from .models import Category, Listing, ListingImage
admin.site.register(Category)
admin.site.register(Listing)
admin.site.register(ListingImage)
