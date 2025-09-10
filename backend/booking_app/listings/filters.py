import django_filters
from .models import RentObject
from decimal import Decimal
import datetime

class ListingFilter(django_filters.FilterSet):
    max_price = django_filters.NumberFilter(method="filter_max_price")
    min_price = django_filters.NumberFilter(method="filter_min_price")

    def filter_max_price(self, queryset, name, value):
        cents = int(Decimal(value) * 100)
        return queryset.filter(day_price_cents__lte=cents)

    def filter_min_price(self, queryset, name, value):
        cents = int(Decimal(value) * 100)
        return queryset.filter(day_price_cents__gte=cents)
    
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    location = django_filters.CharFilter(field_name='town', lookup_expr='icontains')
    type = django_filters.CharFilter(field_name='rental_type', lookup_expr='iexact')
    min_rooms = django_filters.NumberFilter(field_name='rooms', lookup_expr='gte')
    max_rooms = django_filters.NumberFilter(field_name='rooms', lookup_expr='lte')
    min_area = django_filters.NumberFilter(field_name='area', lookup_expr='gte')
    max_area = django_filters.NumberFilter(field_name='area', lookup_expr='lte')
    pets = django_filters.BooleanFilter(field_name='pets_allowed')
    kitchen = django_filters.BooleanFilter(field_name='own_kitchen')
    bathroom = django_filters.BooleanFilter(field_name='own_bathroom')
    parking = django_filters.BooleanFilter(field_name='parking_place')
    min_advance = django_filters.NumberFilter(field_name='advance_days', lookup_expr='lte')
    max_advance = django_filters.NumberFilter(field_name='max_advance_days', lookup_expr='lte')
    edit_deadline = django_filters.NumberFilter(field_name='reservation_edit_deadline', lookup_expr='lte')    
    
    class Meta:
        model = RentObject
        fields = []