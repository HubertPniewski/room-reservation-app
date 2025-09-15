from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model):
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    author = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='reviews')
    object = models.ForeignKey('listings.RentObject', on_delete=models.CASCADE, related_name='reviews')
    description = models.TextField(blank=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('author', 'object')