from rest_framework import generics, permissions
from .models import RentObject
from .serializers import RentObjectSerializer


class ReadOnlyOrIsAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated


class RentObjectListView(generics.ListCreateAPIView):
    queryset = RentObject.objects.all()
    serializer_class = RentObjectSerializer
    permission_classes = [ReadOnlyOrIsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class RentObjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RentObject.objects.all()
    serializer_class = RentObjectSerializer


class MyRentObjectListView(generics.ListAPIView):
    serializer_class = RentObjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RentObject.objects.filter(owner=self.request.user)