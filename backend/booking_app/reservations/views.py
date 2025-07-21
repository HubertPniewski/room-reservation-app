from .models import Reservation
from rest_framework import generics, permissions
from .serializers import ReservationSerializer, IdOnlyReservationSerializer


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

    def get_queryset(self):
        return Reservation.objects.filter(user=self.request.user)
    

class MyObjectsReservationsView(generics.ListAPIView):
    serializer_class = ReservationSerializer
    permission_classes = [CanViewFullDetails]

    def get_queryset(self):
        return Reservation.objects.filter(object__owner=self.request.user)

    