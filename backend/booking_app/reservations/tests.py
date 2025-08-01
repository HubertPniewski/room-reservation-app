from rest_framework.test import APITestCase
from rest_framework import status
from .models import Reservation
from users.models import User
from listings.models import RentObject


class ReservationsTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            first_name="Marek",
            last_name="Kowalek",
            email="user@example.com",
            phone_number="+48669999999",
            password="hssd2178sa",
            terms_accepted=True
        )
        self.user2 = User.objects.create_user(
            first_name="Dorota",
            last_name="Kapusta",
            email="user2@example.com",
            phone_number="+48669999990",
            password="g7d8adss2",
            terms_accepted=True
        )
        self.user3 = User.objects.create_user(
            first_name="Mariusz",
            last_name="Marchewka",
            email="user3@example.com",
            phone_number="+48669999991",
            password="g78asdfgh78",
            terms_accepted=True
        )
        self.rent_object1 = RentObject.objects.create(
            name="someobj1",
            rental_type="room",
            owner=self.user1,
            address="Poziomkowa 13",
            town="Szczebrzeszyn",
            day_price_cents=10000,
            description="asdasjka"
        )
        self.rent_object2 = RentObject.objects.create(
            name="someobj2",
            rental_type="cottage",
            owner=self.user2,
            address="Malinowa 4",
            town="Świebodzin",
            day_price_cents=20000,
            description="sadasdasda"
        )
        self.reservation1 = Reservation.objects.create(
            object=self.rent_object1,
            user=self.user2,
            start_date_time="2045-07-23T09:28:37.766Z",
            end_date_time="2045-07-25T09:28:37.766Z"
        )
        self.reservation2 = Reservation.objects.create(
            object=self.rent_object1,
            user=self.user2,
            start_date_time="2025-08-23T09:28:37.766Z",
            end_date_time="2025-08-25T09:28:37.766Z"
        )
        self.reservation3 = Reservation.objects.create(
            object=self.rent_object2,
            user=self.user3,
            start_date_time="2025-08-23T09:28:37.766Z",
            end_date_time="2025-08-25T09:28:37.766Z"
        )

    # 1. get my reservations
    def test_see_my_reservations(self):
        self.client.force_authenticate(user=self.user2)
        url = '/reservations/my-reservations/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('object', response.data['results'][0])

    # 2. get my reservations unauthorized
    def test_see_my_reservations_unauthorized(self):
        url = '/reservations/my-reservations/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # 3. get specific reservation
    def test_get_specific_reservation(self):
        self.client.force_authenticate(user=self.user2)
        url = f"/reservations/{self.reservation1.id}/"
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['object'], self.rent_object1.id)

    # 4. get specific reservation unauthorized
    def test_get_specific_reservation_unauthorized(self):
        url = f"/reservations/{self.reservation1.id}/"
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # 5. get others reservation
    def test_get_others_reservation(self):
        self.client.force_authenticate(user=self.user3)
        url = f"/reservations/{self.reservation1.id}/"
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 6. get your client's reservation
    def test_get_clients_reservation(self):
        self.client.force_authenticate(user=self.user1)
        url = f"/reservations/{self.reservation1.id}/"
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['object'], self.rent_object1.id)

    # 7. create a new reservation
    def test_create_reservation(self):
        self.client.force_authenticate(user=self.user3)
        url = '/reservations/'
        data = {
            "object": f"{self.rent_object1.id}",
            "start_date_time": "2025-08-27T09:28:37.766Z",
            "end_date_time": "2025-08-29T09:28:37.766Z"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['object'], self.rent_object1.id)

    # 8. create a new reservation with invalid data
    def test_create_reservation_invalid_data(self):
        self.client.force_authenticate(user=self.user3)
        url = '/reservations/'
        data = {
            "object": f"{self.rent_object1.id}",
            "start_date_time": "2025-08-27",
            "end_date_time": "2025"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # 9. edit your reservation
    def test_edit_reservation(self):
        self.client.force_authenticate(user=self.user2)
        url = f"/reservations/{self.reservation1.id}/"
        data = {
            "object": f"{self.rent_object1.id}",
            "start_date_time": "2045-08-27T09:28:37.766Z",
            "end_date_time": "2045-08-29T09:28:37.766Z"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['start_date_time'], '2045-08-27T09:28:37.766000Z')

    # 10. edit others reservation
    def test_edit_others_reservation(self):
        self.client.force_authenticate(user=self.user3)
        url = f"/reservations/{self.reservation1.id}/"
        data = {
            "object": f"{self.rent_object1.id}",
            "start_date_time": "2025-08-27T09:28:37.766Z",
            "end_date_time": "2025-08-29T09:28:37.766Z"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 11. delete others reservation unauthorized
    def test_edit_others_reservation(self):
        url = f"/reservations/{self.reservation1.id}/"
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # 12. delete your own reservation
    def test_delete_reservation(self):
        self.client.force_authenticate(user=self.user2)
        url = f"/reservations/{self.reservation1.id}/"
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # 13. get your clients reservations
    def test_see_my_clients(self):
        self.client.force_authenticate(user=self.user1)
        url = '/reservations/my-clients/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('object', response.data['results'][0])

    # 14. get a reservation of your client, but on someone else's object
    def test_see_my_clients_other_reservations(self):
        self.client.force_authenticate(user=self.user1)
        url = '/reservations/my-clients/'
        response = self.client.get(url, format='json')
        results = response.data['results']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('object', response.data['results'][0])
        self.assertTrue(any(ro['object'] != self.rent_object2.id for ro in results))
