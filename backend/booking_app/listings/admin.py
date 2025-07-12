from django.contrib import admin
from .models import RentObject, RentObjectImage


class RentObjectImageInline(admin.TabularInline):
    model = RentObjectImage
    extra = 1
    max_num = 8

@admin.register(RentObject)
class RentObjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'rental_type', 'owner', 'town')
    inlines = [RentObjectImageInline]