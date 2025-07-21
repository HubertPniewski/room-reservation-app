from django.urls import path
from reservations import views


urlpatterns = [
    path('<int:pk>/', views.ReservationDetailView.as_view()),
    path('my-reservations/', views.MyReservationsView.as_view()),
    path('my-clients/', views.MyObjectsReservationsView.as_view()),
    path('', views.ReservationView.as_view()),
]
