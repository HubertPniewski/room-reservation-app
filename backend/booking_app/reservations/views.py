from .models import Reservation
from rest_framework import generics, permissions
from .serializers import ReservationSerializer, IdOnlyReservationSerializer, ReservationTimeSerializer
from django.shortcuts import get_object_or_404
from listings.models import RentObject

class CanViewFullDetails(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # authenticated
        if not request.user.is_authenticated:
            return False
        
        return request.user == obj.user or request.user == obj.object.owner 


class ReservationView(generics.CreateAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReservationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer
    permission_classes = [CanViewFullDetails]


class MyReservationsView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return Reservation.objects.filter(user=self.request.user)
    

class MyObjectsReservationsView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [CanViewFullDetails]
    pagination_class = None

    def get_queryset(self):
        return Reservation.objects.filter(object__owner=self.request.user)

    
class ObjectReservationsView(generics.ListAPIView):
    pagination_class = None
    permission_classes = []  # public endpoint

    def get_object_instance(self):
        if not hasattr(self, "_object_instance"):
            self._object_instance = get_object_or_404(
                RentObject, id=self.kwargs["pk"]
            )
        return self._object_instance

    def get_queryset(self):
        obj = self.get_object_instance()
        return Reservation.objects.filter(object=obj)

    def get_serializer_class(self):
        obj = self.get_object_instance()
        if self.request.user.is_authenticated and self.request.user == obj.owner:
            return ReservationSerializer   # full details for owner
        return ReservationTimeSerializer   # limited info for everyone else
