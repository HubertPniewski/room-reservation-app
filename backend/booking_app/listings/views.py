from rest_framework import generics, permissions
from .models import RentObject
from .serializers import RentObjectSerializer
from .filters import ListingFilter
from django_filters.rest_framework import DjangoFilterBackend


class ReadOnlyOrIsAuthenticated(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated
    

class IsSelf(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and request.user == obj.owner


class RentObjectListView(generics.ListCreateAPIView):
    queryset = RentObject.objects.all()
    serializer_class = RentObjectSerializer
    permission_classes = [ReadOnlyOrIsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ListingFilter

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class RentObjectDetailView(generics.RetrieveAPIView):
    queryset = RentObject.objects.all()
    serializer_class = RentObjectSerializer
    permission_classes = [permissions.AllowAny]


class MyRentObjectListView(generics.ListAPIView):
    serializer_class = RentObjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RentObject.objects.filter(owner=self.request.user)
    

class EditDeleteRentObjectView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RentObject.objects.all()
    serializer_class = RentObjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsSelf]