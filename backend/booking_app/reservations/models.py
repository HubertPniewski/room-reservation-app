from django.db import models

class Reservation(models.Model):
    object = models.ForeignKey('listings.RentObject', on_delete=models.PROTECT, related_name='reservations')
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='reservations')
    created_at = models.DateTimeField(auto_now_add=True)
    start_date = models.DateField()
    end_date = models.DateField()
    day_price_cents = models.IntegerField()

    class Meta:
        ordering = ['start_date']
        indexes = [
            models.Index(fields=['object', 'start_date']),
        ]

    def save(self, *args, **kwargs):
        if self._state.adding and self.object_id:
            self.day_price_cents = self.object.day_price_cents
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.object}, {self.user}, {self.start_date} - {self.end_date}"