from rest_framework.test import APITestCase
from .models import Review
from users.models import User
from listings.models import RentObject
from rest_framework import status


class ReviewsTests(APITestCase):
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
        self.review1 = Review.objects.create(
            rating=5,
            author=self.user2,
            object=self.rent_object1,
            description="Sehr gut.",
        )
        self.review2 = Review.objects.create(
            rating=5,
            author=self.user3,
            object=self.rent_object1,
            description="Ganz ok.",
        )
        self.review3 = Review.objects.create(
            rating=1,
            author=self.user1,
            object=self.rent_object2,
            description="Sehr schlecht.",
        )
    
    def test_get_reviews_by_object(self):
        url = f"/reviews/object/{self.rent_object1.id}/"
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ratings = [r['rating'] for r in response.data['results']]
        self.assertTrue(all(r == 5 for r in ratings))

    def test_get_reviews_from_not_existing_object(self):
        url = "/reviews/object/12389/"
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_post_new_review(self):
        self.client.force_authenticate(user=self.user3)
        url = f"/reviews/object/{self.rent_object2.id}/"
        data = {
            "rating": 4,
            "description": "wow",
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(4, response.data['rating'])

    def test_post_new_review_unauthenticated(self):
        url = f"/reviews/object/{self.rent_object2.id}/"
        data = {
            "rating": 4,
            "description": "wow",
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_2nd_review(self):
        self.client.force_authenticate(user=self.user3)
        url = f"/reviews/object/{self.rent_object1.id}/"
        data = {
            "rating": 4,
            "description": "wow",
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_review_details(self):
        url = f"/reviews/{self.review1.id}/"
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual('Sehr gut.', response.data['description'])

    def test_edit_review(self):
        self.client.force_authenticate(user=self.user3)
        url = f"/reviews/{self.review2.id}/"
        data = {
            "rating": 4,
            "description": "wow",
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(4, response.data['rating'])
        self.assertEqual("wow", response.data['description'])

    def test_edit_review_unauthorized(self):
        url = f"/reviews/{self.review2.id}/"
        data = {
            "rating": 4,
            "description": "wow",
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_edit_someone_others_review(self):
        self.client.force_authenticate(user=self.user3)
        url = f"/reviews/{self.review3.id}/"
        data = {
            "rating": 4,
            "description": "wow",
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_review(self):
        self.client.force_authenticate(user=self.user3)
        url = f"/reviews/{self.review2.id}/"
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)