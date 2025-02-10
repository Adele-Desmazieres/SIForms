from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import Account
from rest_framework.authtoken.models import Token

class CreateAccountViewTest(APITestCase):
    def test_create_account(self):
        url = reverse('Account')
        data = {
            'email': 'test@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'password': 'password123',
            'phone': '1234567890',
            'lang': 'en'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 1)
        self.assertEqual(Account.objects.get().email, 'test@example.com')
        self.assertEqual(Account.objects.get().email, 'test@example.com')

    def test_create_account_missing_fields(self):
        url = reverse('Account')
        data = {
            'email': 'test@example.com',
            'first_name': 'John',
            # 'last_name' is missing
            'password': 'password123',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('last_name', response.data)

class ChangePasswordViewTest(APITestCase):
    def setUp(self):
        self.email = 'test@example.com'
        self.password = 'password123'
        self.user = Account.objects.create(
            email=self.email,
            first_name='John',
            last_name='Doe',
            phone='1234567890',
            lang='en'
        )
        self.user.set_password(self.password)
        self.user.save()
        login_url = reverse('login')
        login_data = {'email': self.email, 'password': self.password}
        login_response = self.client.post(login_url, login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('token', login_response.data)

        self.token = login_response.data['token']
        self.url = reverse('change-password')

    def test_change_password_success(self):
        data = {
            'old_password': self.password,
            'new_password': 'newpassword'
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token}')
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword'))

    def test_change_password_wrong_old_password(self):
        data = {
            'old_password': 'wrongpassword',
            'new_password': 'newpassword'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_change_password_missing_fields(self):
        data = {
            'old_password': self.password,
            # 'new_password' is missing
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

class ChangeLanguageViewTest(APITestCase):
    def setUp(self):
        self.email = 'test@example.com'
        self.password = 'password123'
        self.user = Account.objects.create(
            email=self.email,
            first_name='John',
            last_name='Doe',
            phone='1234567890',
            lang='en'
        )
        self.user.set_password(self.password)
        self.user.save()
        login_url = reverse('login')
        login_data = {'email': self.email, 'password': self.password}
        login_response = self.client.post(login_url, login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('token', login_response.data)

        self.token = login_response.data['token']
        self.url = reverse('change-language')

    def test_change_language_success(self):
        data = {
            'lang': 'fr'
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.lang, 'fr')
        print("user", self.user.lang)
    
    

    def test_change_language_missing_field(self):
        data = {
            # 'lang' is missing
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)