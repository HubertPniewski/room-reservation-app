from django.db import models

from ..reviews.models import Review

class RentObject(models.Model):
    class RentalType(models.TextChoices):
        ROOM = 'room',
        APARTMENT = 'apartment',
        COTTAGE = 'cottage'

    name = models.CharField(max_length=255)
    rental_type = models.CharField(
        max_length=20,
        choices=RentalType.choices,
        default=RentalType.ROOM
    )
    address = models.CharField(max_length=200)
    town = models.CharField(max_length=58)
    day_price = models.models.IntegerField()
    reviews = models.models.ForeignKey(Review, on_delete=models.CASCADE)