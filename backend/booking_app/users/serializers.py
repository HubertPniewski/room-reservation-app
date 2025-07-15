from .models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'address',
            'town',
            'date_joined',
            'profile_image',
            'objects',
            'terms_accepted',
        )
        read_only_fields = ['date_joined']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    terms_accepted = serializers.BooleanField(write_only=True)

    class Meta:
        model = User
        fields = (
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'address',
            'town',
            'profile_image',
            'password',
            'terms_accepted',
        )

    def validate_terms_accepted(self, value):
        if not value:
            raise serializers.ValidationError('Terms must be accepted.')
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email = validated_data['email'],
            first_name = validated_data.get('first_name', ''),
            last_name = validated_data.get('last_name', ''),
            password = validated_data['password'],
            address = validated_data.get('address', ''),
            town = validated_data.get('town', ''),
            profile_image = validated_data.get('profile_image', ''),
            phone_number = validated_data.get('phone_number', ''),
            terms_accepted = validated_data.get('terms_accepted', ''),
        )
        return user