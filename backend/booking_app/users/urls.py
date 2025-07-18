from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from users import views


urlpatterns = [
    path('<int:pk>/', views.UserPublicDetailView.as_view()),
    path('<int:pk>/full', views.UserFullDetailView.as_view()),
    path('', views.UserRegisterView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = format_suffix_patterns(urlpatterns)