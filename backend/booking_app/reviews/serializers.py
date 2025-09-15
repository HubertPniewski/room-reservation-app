from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['author', 'modified']

    def validate(self, attrs):
        author = attrs.get('author') or self.context['request'].user
        obj = attrs.get('object')
        request = self.context.get('request')

        if request and request.method == 'POST' and Review.objects.filter(author=author, object=obj).exists():
            raise serializers.ValidationError("You have already reviewed that object.")
        return attrs