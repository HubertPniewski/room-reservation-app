from rest_framework import serializers
from .models import RentObject, RentObjectImage


class RentObjectImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = RentObjectImage
        fields = ['id', 'image_url', 'index']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None
    

class RentObjectSerializer(serializers.ModelSerializer):
    images = RentObjectImageSerializer(many=True, read_only=True)
    new_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    average_rating = serializers.FloatField(read_only=True)
    reviews_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = RentObject
        fields = (
            'id',
            'name',
            'rental_type',
            'rooms',
            'area',
            'owner',
            'address',
            'town',
            'day_price_cents',
            'pets_allowed',
            'own_kitchen',
            'own_bathroom',
            'parking_place',
            'description',
            'reservation_edit_deadline',
            'reservation_break_days',
            'check_in_start_hour',
            'check_in_end_hour',
            'check_out_start_hour',
            'check_out_end_hour',
            'images',
            'new_images',
            'advance_days',
            'max_advance_days',
            'average_rating',
            'reviews_count',
        )
        read_only_fields = ['owner']

    def validate_images(self, images):
        if len(images) > 8:
            raise serializers.ValidationError("You can upload not more than 8 images")
        return images

    def update(self, instance, validated_data):
        #extract uploaded images
        new_images = validated_data.pop('new_images', [])

        # update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # append new images
        for img in new_images:
            RentObjectImage.objects.create(rent_object=instance, image=img)

        return instance
    
    def create(self, validated_data):
        new_images = validated_data.pop('new_images', [])
        instance = super().create(validated_data)
        for img in new_images:
            RentObjectImage.objects.create(rent_object=instance, image=img)
        return instance