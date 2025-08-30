from django.contrib import admin

from .models import Reservation

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('id', 'object', 'user', 'start_date', 'end_date')
    readonly_fields = ('id', )
