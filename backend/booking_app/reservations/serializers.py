from rest_framework import serializers
from .models import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id', 'object', 'user', 'start_date_time', 'end_date_time']
        read_only_fields = ['user',]


class IdOnlyReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id']