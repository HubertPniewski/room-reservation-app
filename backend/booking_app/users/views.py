from .models import User
from rest_framework import generics, permissions, status
from .serializers import UserPublicSerializer, UserFullSerializer, UserRegistrationSerializer
from reservations.models import Reservation
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from django.middleware import csrf
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.permissions import AllowAny


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
    

class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated(), IsSelf()]

    def get_serializer_class(self):
        user = self.request.user
        obj = self.get_object()
        if user == obj:
            return UserFullSerializer
        elif CanViewFullDetails().has_object_permission(self.request, self, obj):
            return UserFullSerializer
        else:
            return UserPublicSerializer

    
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

        serializer = TokenObtainPairSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
        tokens = serializer.validated_data
        user = serializer.user

        resp = Response({
            "detail": "Logged in",
            "user": UserFullSerializer(user).data
        }, status=status.HTTP_200_OK)

        resp.set_cookie(
            "access",
            tokens["access"],
            httponly=True,
            secure=True,
            samesite="None",
            max_age=900, # 15 minutes
            path="/",
        )

        resp.set_cookie(
            "refresh",
            tokens["refresh"],
            httponly=True,
            secure=True,
            samesite="None",
            max_age=1296000, # 15 days
            path="/auth/token/refresh/",
        )
        
        # ensure csrf cookie is set (non-httponly)
        csrf.get_token(request)

        return resp
    

class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.COOKIES.get("refresh")
        if not refresh:
            return Response({"detail": "Refresh token missing"}, status=status.HTTP_401_UNAUTHORIZED)
        from rest_framework_simplejwt.serializers import TokenRefreshSerializer

        serializer = TokenRefreshSerializer(data={"refresh": refresh})
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response({"detail": "Invalid refresh"}, status=status.HTTP_401_UNAUTHORIZED)
        
        access = serializer.validated_data["access"]
        resp = Response({"detail": "Token refreshed"}, status=status.HTTP_200_OK)
        resp.set_cookie(
            "access",
            access,
            httponly=True,
            secure=True,
            samesite="None",
            max_age=900, # 15 minutes
            path="/",
        )
        return resp
    
class LogoutView(APIView):
    def post(self, request):
        resp = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
        resp.delete_cookie("access", path="/")
        resp.delete_cookie("refresh", path="/auth/token/refresh/")
        return resp