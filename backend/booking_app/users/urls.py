from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from users import views


urlpatterns = [
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/token/refresh/', views.CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', views.LogoutView.as_view(), name='logout'),
    path('me/', views.UserMeRedirectView.as_view()),
    path('<int:pk>/', views.UserDetailView.as_view()),
    path('', views.UserRegisterView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = format_suffix_patterns(urlpatterns)