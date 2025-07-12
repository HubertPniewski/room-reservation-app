from django.db import models

class Review(models.Model):
    rating = models.IntegerField(validators=[])
    author = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='reviews')
    object = models.ForeignKey('listings.RentObject', on_delete=models.CASCADE, related_name='reviews')
    description = models.TextField(blank=True)
    created = models.DateTimeField(auto_now_add=True)