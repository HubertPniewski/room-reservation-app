from django.db import models

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
    owner = models.ForeignKey('users.User', on_delete=models.PROTECT, related_name='rental_objects')
    address = models.CharField(max_length=200)
    town = models.CharField(max_length=58)
    day_price_cents = models.IntegerField()
    description = models.TextField(blank=True)


    class Meta:
        indexes = [
            models.Index(fields=['town']),
            models.Index(fields=['rental_type']),
        ]

    def __str__(self):
        return f"{self.name} ({self.rental_type}) - {self.town}"
    

class RentObjectImage(models.Model):
    rent_object = models.ForeignKey(RentObject, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='rent_objects/')
    uploaded_at = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.rent_object.name}"