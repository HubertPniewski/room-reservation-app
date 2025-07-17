from .models import User
from rest_framework import generics, permissions
from .serializers import UserPublicSerializer, UserFullSerializer, UserRegistrationSerializer
from reservations.models import Reservation


class CanViewFullDetails(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # authenticated
        if not request.user.is_authenticated:
            return False
        # account owner
        if obj == request.user:
            return True
        # request.owner is owner of object reserved by obj
        isOwner = Reservation.objects.filter(
            user=obj,
            object__owner=request.user
        ).exists()
        # request.owner is client of obj
        isClient = Reservation.objects.filter(
            user=request.user,
            object__owner=obj
        ).exists()
        return isOwner or isClient


class UserPublicDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserPublicSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class UserFullDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserFullSerializer
    permission_classes = [CanViewFullDetails]


class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]