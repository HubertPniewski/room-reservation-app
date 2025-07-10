from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

from ..listings.models import RentObject
from ..reservations.models import Reservation

class User(AbstractBaseUser):
    first_name = models.CharField(max_length=35)
    last_name = models.CharField(max_length=35)
    email = models.EmailField(unique=True)
    phone_number = models.models.CharField(max_length=15)
    address = models.CharField(max_length=200)
    town = models.CharField(max_length=58)
    date_joined = models.DateTimeField(default=timezone.now, editable=False)
    rental_objects = models.ForeignKey(RentObject, on_delete=models.CASCADE, related_name='rental-objects')
    reservations = models.ForeignKey(Reservation, on_delete=models.PROTECT, related_name='reservations')
