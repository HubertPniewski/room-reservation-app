from rest_framework import serializers
from .models import RentObject, RentObjectImage


class RentObjectImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = RentObjectImage
        fields = ['id', 'image_url']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None
    

class RentObjectSerializer(serializers.ModelSerializer):
    images = RentObjectImageSerializer(many=True, read_only=True)

    class Meta:
        model = RentObject
        fields = (
            'id',
            'name',
            'rental_type',
            'owner',
            'address',
            'town',
            'day_price_cents',
            'description',
            'images',
        )
        read_only_fields = ['owner']