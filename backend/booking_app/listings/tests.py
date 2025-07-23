from rest_framework.test import APITestCase
from rest_framework import status
from .models import RentObject
from users.models import User


class ListingsTests(APITestCase):
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
    # 1. get rent objects list
    def test_get_rent_objects_list(self):
        url = '/listings/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("rental_type", response.data["results"][0])
        self.assertGreaterEqual(response.data['count'], 2)
        results = response.data['results']
        self.assertTrue(any(ro['rental_type'] == 'room' for ro in results))
        self.assertTrue(any(ro['rental_type'] == 'cottage' for ro in results))

    # 2. create rent object
    def test_create_rent_object(self):
        self.client.force_authenticate(user=self.user1)
        url = '/listings/'
        data = {
            "name": "newObj",
            "rental_type": "room",
            "address": "Truskawkowa 34",
            "town": "Grudziądz",
            "day_price_cents": "15000",
            "description": "bul bul"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['town'], 'Grudziądz')

    # 3. create rent object with wrong data
    def test_create_rent_object_wrong_data(self):
        self.client.force_authenticate(user=self.user1)
        url = '/listings/'
        data = {
            "name": "newObj",
            "rental_type": "barn",
            "address": "Truskawkowa 34",
            "town": "Grudziądz",
            "day_price_cents": "15000",
            "description": "bul bul"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('rental_type', response.data)

    # 4. create rent object without authorization
    def test_create_rent_object_unauthorized(self):
        url = '/listings/'
        data = {
            "name": "newObj",
            "rental_type": "room",
            "address": "Truskawkowa 34",
            "town": "Grudziądz",
            "day_price_cents": "15000",
            "description": "bul bul"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # 5. get specific rent object
    def test_get_specific_rent_object(self):
        url = f'/listings/{self.rent_object1.id}/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('someobj1', response.data['name'])

    # 6. edit your own object
    def test_edit_own_object(self):
        self.client.force_authenticate(user=self.user1)
        url = f'/listings/{self.rent_object1.id}/'
        data = {
            "name": "someobj1",
            "rental_type": "room",
            "address": "Poziomkowa 13",
            "town": "Szczebrzeszyn",
            "day_price_cents": "15000",
            "description": "bul bul"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(15000, response.data['day_price_cents'])

    # 6. edit someone else's object
    def test_edit_elses_object(self):
        self.client.force_authenticate(user=self.user2)
        url = f'/listings/{self.rent_object1.id}/'
        data = {
            "name": "someobj1",
            "rental_type": "room",
            "address": "Poziomkowa 13",
            "town": "Szczebrzeszyn",
            "day_price_cents": "15000",
            "description": "bul bul"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 7. edit object, unauthorized
    def test_edit_object_unauthorized(self):
        url = f'/listings/{self.rent_object1.id}/'
        data = {
            "name": "someobj1",
            "rental_type": "room",
            "address": "Poziomkowa 13",
            "town": "Szczebrzeszyn",
            "day_price_cents": "15000",
            "description": "bul bul"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # 8. edit your own object, invalid data
    def test_edit_own_object_wrong_data(self):
        self.client.force_authenticate(user=self.user1)
        url = f'/listings/{self.rent_object1.id}/'
        data = {
            "name": "someobj1",
            "rental_type": "barn",
            "address": "Poziomkowa 13",
            "town": "Szczebrzeszyn",
            "day_price_cents": "15000",
            "description": "bul bul"
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
