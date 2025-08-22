from rest_framework import generics, permissions
from .models import RentObject
from .serializers import RentObjectSerializer
from .filters import ListingFilter
from django_filters.rest_framework import DjangoFilterBackend
   

class IsSelf(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and request.user == obj.owner


class RentObjectListView(generics.ListCreateAPIView):
    queryset = RentObject.objects.all()
    serializer_class = RentObjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = ListingFilter

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class RentObjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = RentObject.objects.all()
    serializer_class = RentObjectSerializer
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticatedOrReadOnly()]
        else:
            return [permissions.IsAuthenticated(), IsSelf()]


class MyRentObjectListView(generics.ListAPIView):
    serializer_class = RentObjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RentObject.objects.filter(owner=self.request.user)
    

class RentObjectsByUsersId(generics.ListAPIView):
    serializer_class = RentObjectSerializer
    permission_classes = []

    def get_queryset(self):
        user_id = self.kwargs.get("user_id")
        return RentObject.objects.filter(owner=user_id)
    