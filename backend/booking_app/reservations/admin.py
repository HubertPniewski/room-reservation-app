from django.contrib import admin

from .models import Reservation

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ('object', 'user', 'start_date_time', 'end_date_time')
