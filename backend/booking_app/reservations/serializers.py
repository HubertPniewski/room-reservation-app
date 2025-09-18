from rest_framework import serializers
from .models import Reservation
from datetime import timedelta
from django.utils import timezone


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id', 'object', 'user', 'created_at', 'start_date', 'end_date', 'day_price_cents']
        read_only_fields = ['user', 'day_price_cents', 'created_at']

    def validate(self, data):
        instance = self.instance
        if instance:
            start = instance.start_date_time
            limit = instance.object.reservation_edit_deadline
            now = timezone.now()
            if abs(start - now < timedelta(days=limit)):
                raise serializers.ValidationError(
                    f"The reservation cannot be modified later than {limit} days before the reservation start date."
                )
        return data
    
class ReservationTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['start_date', 'end_date']
    

class IdOnlyReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id']