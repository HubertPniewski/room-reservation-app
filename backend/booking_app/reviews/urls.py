from django.urls import path
from reviews import views

urlpatterns = [
    path('<int:pk>/', views.ReviewView.as_view()),
    path('object/<int:object_id>/', views.ReviewsByObjectView.as_view()),
]
