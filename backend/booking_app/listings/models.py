from django.db import models
from datetime import time
from django.core.validators import MinValueValidator, MaxValueValidator
import os, uuid

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
    rooms = models.IntegerField(default=1)
    area = models.FloatField(default=0)
    owner = models.ForeignKey('users.User', on_delete=models.PROTECT, related_name='rental_objects')
    address = models.CharField(max_length=200)
    town = models.CharField(max_length=58)
    day_price_cents = models.IntegerField()
    pets_allowed = models.BooleanField(default=False)
    own_kitchen = models.BooleanField(default=False)
    own_bathroom = models.BooleanField(default=False)
    parking_place = models.BooleanField(default=False)
    description = models.TextField(blank=True)
    reservation_edit_deadline = models.IntegerField(default=7)
    reservation_break_days = models.IntegerField(default=0)
    check_in_start_hour = models.TimeField(default=time(8, 0))
    check_in_end_hour = models.TimeField(default=time(20, 0))
    check_out_start_hour = models.TimeField(default=time(8, 0))
    check_out_end_hour = models.TimeField(default=time(20, 0))
    advance_days = models.IntegerField(default=7)
    max_advance_days = models.IntegerField(default=365)


    class Meta:
        indexes = [
            models.Index(fields=['town']),
            models.Index(fields=['rental_type']),
        ]

    def __str__(self):
        return f"{self.name} ({self.rental_type}) - {self.town}"
    

def rent_object_image_path(instance, filename):
    ext = filename.split('.')[-1]
    filename = f"rentobject_{instance.rent_object.id}_{uuid.uuid4().hex}.{ext}"
    return os.path.join('rent_objects', filename)

class RentObjectImage(models.Model):
    rent_object = models.ForeignKey(RentObject, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='rent_objects/')
    index = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(7)])

    class Meta:
        ordering = ['index']

    def __str__(self):
        return f"Image for {self.rent_object.name}"