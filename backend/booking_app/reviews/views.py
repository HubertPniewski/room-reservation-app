from .models import Review
from .serializers import ReviewSerializer
from rest_framework import generics, permissions
from listings.models import RentObject
from django.shortcuts import get_object_or_404

class IsAuthor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        return obj.author == request.user


class ReviewsByObjectView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Review.objects.filter(object_id=self.kwargs['object_id']).order_by('-modified')
    
    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx['rent_object'] = get_object_or_404(RentObject, pk=self.kwargs['object_id'])
        return ctx
    
    def perform_create(self, serializer):
        rent_object = get_object_or_404(RentObject, pk=self.kwargs['object_id'])
        serializer.save(author=self.request.user, object=rent_object)
    
  
class ReviewView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()

    def get_permissions(self):
        return [permissions.AllowAny()] if self.request.method in ['GET'] else [IsAuthor()]

