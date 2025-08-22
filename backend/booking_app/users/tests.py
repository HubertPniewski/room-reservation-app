from rest_framework.test import APITestCase
from rest_framework import status
from .models import User

class UserTests(APITestCase):
    # 1. working registration
    def test_user_registration(self):
        url = "/users/"
        data = {
            "first_name": "Marek",
            "last_name": "Kowalek",
            "email": "user@example.com",
            "phone_number": "+48669999999",
            "password": "hssd2178sa",
            "terms_accepted": True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

    # 2. registration without accepted terms
    def test_user_registration_missing_terms(self):
        url = "/users/"
        data = {
            "first_name": "Marek",
            "last_name": "Kowalek",
            "email": "user@example.com",
            "phone_number": "+48669999999",
            "password": "hssd2178sa"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('terms_accepted', response.data)

    # 3. registration with wrong email
    def test_user_registration_wrong_email(self):
        url = "/users/"
        data = {
            "first_name": "Marek",
            "last_name": "Kowalek",
            "email": "userexample.com",
            "phone_number": "+48669999999",
            "password": "hssd2178sa",
            "terms_accepted": True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    # 4. registration with wrong password
    def test_user_registration_wrong_password(self):
        url = "/users/"
        data = {
            "first_name": "Marek",
            "last_name": "Kowalek",
            "email": "user@example.com",
            "phone_number": "+48669999999",
            "password": "2178",
            "terms_accepted": True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    # 5. registration with wrong phone number
    def test_user_registration_wrong_phone_number(self):
        url = "/users/"
        data = {
            "first_name": "Marek",
            "last_name": "Kowalek",
            "email": "user@example.com",
            "phone_number": "+4812999999",
            "password": "hssd2178sa",
            "terms_accepted": True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone_number', response.data)

    # 6. correct login 
    def test_user_login(self):
        user = User.objects.create_user(
            first_name="Marek",
            last_name="Kowalek",
            email="user@example.com",
            phone_number="+48669999999",
            password="hssd2178sa",
            terms_accepted=True
        )
        url = '/users/auth/login/'
        data = {
            "email": "user@example.com",
            "password": "hssd2178sa"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # 7. login, missing password
    def test_user_login_missing_password(self):
        user = User.objects.create_user(
            first_name="Marek",
            last_name="Kowalek",
            email="user@example.com",
            phone_number="+48669999999",
            password="hssd2178sa",
            terms_accepted=True
        )
        url = '/users/auth/login/'
        data = {
            "email": "user@example.com"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)

    # 8. login, wrong password
    def test_user_login_wrong_password(self):
        user = User.objects.create_user(
            first_name="Marek",
            last_name="Kowalek",
            email="user@example.com",
            phone_number="+48669999999",
            password="hssd2178sa",
            terms_accepted=True
        )
        url = '/users/auth/login/'
        data = {
            "email": "user@example.com",
            "password": "hssd2178sa11"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # 9. login, wrong email
    def test_user_login_wrong_email(self):
        user = User.objects.create_user(
            first_name="Marek",
            last_name="Kowalek",
            email="user@example.com",
            phone_number="+48669999999",
            password="hssd2178sa",
            terms_accepted=True
        )
        url = '/users/auth/login/'
        data = {
            "email": "user@exampl.com",
            "password": "hssd2178sa"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class UserAccessTests(APITestCase):
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
        self.url = f"/users/{self.user1.id}/"

    # 10. can anyone view user's public details
    def test_user_details_public_access(self):
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("first_name", response.data)
        self.assertNotIn("email", response.data)

    # 11. can user view his own details
    def test_user_details_private_access(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("first_name", response.data)
        self.assertIn("email", response.data)

    # 12. can logged user view others full details
    def test_user_details_private_other_access(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("first_name", response.data)
        self.assertNotIn("email", response.data)

    # 13. can users edit their profiles
    def test_user_edit_account(self):
        data = {
            "first_name": "Janusz"
        }
        self.client.force_authenticate(user=self.user1)
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Janusz')

    # 14. can users edit others' profiles
    def test_user_edit_others_account(self):
        data = {
            "first_name": "Janusz"
        }
        self.client.force_authenticate(user=self.user2)
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 15. can users edit their profiles with invalid data
    def test_user_edit_account_invalid_data(self):
        data = {
            "email": "123fsa.pl"
        }
        self.client.force_authenticate(user=self.user1)
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)
        
    # 16. users/me/
    def test_users_me_redirect(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.patch(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("email", response.data)
        self.assertEqual(response.data['id'], self.user1.id)

    # 17. delete my account
    def test_user_delete(self):
        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # 18. delete other user's account
    def test_user_delete_other(self):
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 19. delete an account without authorization
    def test_user_delete_unauthorized(self):
        response = self.client.delete(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
