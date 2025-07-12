from django.db import models

class Reservation(models.Model):
    object = models.ForeignKey('listings.RentObject', on_delete=models.PROTECT, related_name='reservations')
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='reservations')
    start_date_time = models.DateTimeField()
    end_date_time = models.DateTimeField()

    class Meta:
        ordering = ['start_date_time']
        indexes = [
            models.Index(fields=['object', 'start_date_time']),
        ]

    def __str__(self):
        return f"{self.object}, {self.user}, {self.start_date_time} - {self.end_date_time}"