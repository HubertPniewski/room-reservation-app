from django.contrib import admin

from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'rating', 'author', 'object', 'description', 'modified')
