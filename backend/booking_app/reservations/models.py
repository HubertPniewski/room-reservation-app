from django.db import models

#from ..listings.models import RentObject
#from ..users.models import User

class Reservation(models.Model):
    object = models.OneToOneField('listings.RentObject', on_delete=models.CASCADE)
    user = models.OneToOneField('users.User', on_delete=models.CASCADE)
    start_date_time = models.DateTimeField()
    end_date_time = models.DateTimeField()