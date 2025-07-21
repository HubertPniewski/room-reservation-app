import django_filters
from .models import RentObject


class ListingFilter(django_filters.FilterSet):
    max_price = django_filters.NumberFilter(field_name='day_price_cents', lookup_expr='lte')
    min_price = django_filters.NumberFilter(field_name='day_price_cents', lookup_expr='gte')
    location = django_filters.CharFilter(field_name='town', lookup_expr='icontains')
    
    class Meta:
        model = RentObject
        fields = ['rental_type']