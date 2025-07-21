from .models import User
from rest_framework import generics, permissions
from .serializers import UserPublicSerializer, UserFullSerializer, UserRegistrationSerializer
from reservations.models import Reservation
from django.shortcuts import redirect
from rest_framework.views import APIView


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
    

class IsSelf(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and request.user == obj


class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]


class UserMeRedirectView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        return redirect(f'/users/{request.user.id}/')
    

# nowy widok
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        user = self.request.user
        obj = self.get_object()
        if user == obj:
            return UserFullSerializer
        elif CanViewFullDetails().has_object_permission(self.request, self, obj):
            return UserFullSerializer
        else:
            return UserPublicSerializer

    def check_object_permissions(self, request, obj):
        if request.method in ['PUT', 'PATCH', 'DELETE']:
            if obj != request.user:
                self.permission_denied(
                    request,
                    message="You can edit only your own profile."
                )
        elif request.method == 'GET':
            if obj == request.user:
                return
            elif not CanViewFullDetails().has_object_permission(request, self, obj):
                self.permission_denied(
                    request,
                    message="You have no access to this user's full data."
                )
    