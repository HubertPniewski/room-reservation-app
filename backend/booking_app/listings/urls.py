from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from listings import views

urlpatterns = [
    path('', views.RentObjectListView.as_view()),
    path('<int:pk>/', views.RentObjectDetailView.as_view()),
    path('my-objects/', views.MyRentObjectListView.as_view(), name='my-rent-objects'),
    path('user/<int:user_id>/', views.RentObjectsByUsersId.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns = format_suffix_patterns(urlpatterns)