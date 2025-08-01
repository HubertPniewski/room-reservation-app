from rest_framework import serializers
from .models import Reservation
from datetime import timedelta
from django.utils import timezone


class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id', 'object', 'user', 'start_date_time', 'end_date_time']
        read_only_fields = ['user',]

    def validate(self, data):
        instance = self.instance
        if instance:
            start = instance.start_date_time
            limit = instance.object.reservation_edit_deadline
            now = timezone.now()
            if start - now < timedelta(days=limit):
                raise serializers.ValidationError(
                    f"The reservation cannot be modified later than {limit} days before the reservation start date."
                )
        return data
    

class IdOnlyReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['id']