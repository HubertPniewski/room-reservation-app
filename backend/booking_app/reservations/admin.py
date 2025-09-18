from django.contrib import admin

from .models import Reservation

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('id', 'object', 'user', 'created_at', 'start_date', 'end_date', 'day_price_cents')
    readonly_fields = ('id',)
