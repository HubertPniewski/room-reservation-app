from django.contrib import admin
from .models import RentObject, RentObjectImage


class RentObjectImageInline(admin.TabularInline):
    model = RentObjectImage
    extra = 1
    max_num = 8

@admin.register(RentObject)
class RentObjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'rental_type', 'owner', 'town', 'id')
    inlines = [RentObjectImageInline]

    @admin.display(description='Day price')
    def formatted_day_price_cents(self, obj):
        if obj.day_price_cents is not None:
            return f'{obj.day_price_cents/100:.2f} zł'
        return '-'