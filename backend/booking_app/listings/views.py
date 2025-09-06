from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import RentObject, RentObjectImage
from .serializers import RentObjectSerializer
from .filters import ListingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.parsers import MultiPartParser, FormParser
import json
   

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
    parser_classes = [MultiPartParser, FormParser]
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.IsAuthenticatedOrReadOnly()]
        else:
            return [permissions.IsAuthenticated(), IsSelf()]
        
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()

        # update RentObject fields
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # update indexes for existing images
        images_data = request.data.getlist('images_data[]')
        images_to_delete = list(RentObjectImage.objects.filter(rent_object=instance))
        for item in images_data:
            data = json.loads(item)
            for img in images_to_delete:
                if img.id == data['id']:
                    images_to_delete.remove(img)
                    break
            RentObjectImage.objects.filter(id=data['id'], rent_object=instance).update(index=data['index'])

        for img in images_to_delete:
            img.delete()
        

        # handle new images
        new_images = request.FILES.getlist('new_images')
        new_indexes = request.data.getlist('new_images_indexes[]')

        for i, img_file in enumerate(new_images):
            index = int(new_indexes[i]) if i < len(new_images) else 0
            RentObjectImage.objects.create(
                rent_object=instance,
                image=img_file,
                index=index
            )

        # refresh instance
        instance.refresh_from_db()

        return Response(self.get_serializer(instance).data, status=status.HTTP_200_OK)

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
    