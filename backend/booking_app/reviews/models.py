from django.db import models

class Review(models.Model):
    rating = models.IntegerField()
    author = models.OneToOneField("users.User", on_delete=models.CASCADE)