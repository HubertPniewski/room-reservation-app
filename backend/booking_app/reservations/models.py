from django.db import models

class Reservation(models.Model):
    object = models.ForeignKey('listings.RentObject', on_delete=models.PROTECT, related_name='reservations')
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='reservations')
    start_date = models.DateField()
    end_date = models.DateField()

    class Meta:
        ordering = ['start_date']
        indexes = [
            models.Index(fields=['object', 'start_date']),
        ]

    def __str__(self):
        return f"{self.object}, {self.user}, {self.start_date} - {self.end_date}"