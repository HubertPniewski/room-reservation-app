from .models import User
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password


class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'last_name',
            'date_joined',
            'profile_image',
            'rental_objects',
        )
        read_only_fields = ['date_joined']


class UserFullSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'last_name',
            'email',
            'phone_number',
            'date_joined',
            'profile_image',
            'rental_objects',
        )


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
            profile_image = validated_data.get('profile_image', ''),
            phone_number = validated_data.get('phone_number', ''),
            terms_accepted = validated_data.get('terms_accepted', ''),
        )
        return user
    

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password incorrect")
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user