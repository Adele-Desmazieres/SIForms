from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import Account
from rest_framework.authtoken.models import Token
import datetime

class LoginViewTest(APITestCase):
    def setUp(self):
        self.email = 'test@example.com'
        self.password = 'password123'
        self.user = Account.objects.create(
            email=self.email,
            first_name='John',
            last_name='Doe',
            phone='1234567890',
            lang='en',
        )
        self.user.set_password(self.password)
        self.user.save()

    def test_login_success(self):
        url = reverse('login')
        data = {
            'email': self.email,
            'password': self.password
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('expires_in_days', response.data)
        self.assertIn('user', response.data)

        token = response.data['token']
        token_obj = Token.objects.get(key=token)
        self.assertEqual(token_obj.user, self.user)

    def test_login_failure(self):
        url = reverse('login')
        data = {
            'email': self.email,
            'password': 'wrongpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'], 'Invalid credentials.')

    def test_login_missing_email(self):
        url = reverse('login')
        data = {
            'password': self.password
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Email and password are required.')

    def test_login_missing_password(self):
        url = reverse('login')
        data = {
            'email': self.email
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Email and password are required.')

    def test_login_inactive_user(self):
        self.user.is_active = False
        self.user.save()
        url = reverse('login')
        data = {
            'email': self.email,
            'password': self.password
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['error'], 'Invalid credentials.')

class LogoutViewTest(APITestCase):
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

    def test_logout_success(self):
        # Login
        login_url = reverse('login')
        login_data = {'email': self.email, 'password': self.password}
        login_response = self.client.post(login_url, login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('token', login_response.data)

        token = login_response.data['token']
        token_obj = Token.objects.get(key=token)
        self.assertEqual(token_obj.user, self.user)

        # Logout
        logout_url = reverse('logout')
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        logout_response = self.client.post(logout_url)
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)
        self.assertEqual(logout_response.data['message'], 'Logged out successfully.')

        # Verify token is deleted
        with self.assertRaises(Token.DoesNotExist):
            Token.objects.get(key=token)

    def test_logout_unauthenticated(self):
        logout_url = reverse('logout')
        response = self.client.post(logout_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_invalid_token(self):
        logout_url = reverse('logout')
        self.client.credentials(HTTP_AUTHORIZATION='Token invalidtoken')
        response = self.client.post(logout_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_expired_token(self):
        # Login
        login_url = reverse('login')
        login_data = {'email': self.email, 'password': self.password}
        login_response = self.client.post(login_url, login_data, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertIn('token', login_response.data)

        token = login_response.data['token']
        token_obj = Token.objects.get(key=token)
        self.assertEqual(token_obj.user, self.user)

        # Simulate token expiration
        token_obj.created = token_obj.created - datetime.timedelta(days=11)
        token_obj.save()

        # Logout
        logout_url = reverse('logout')
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {token}')
        logout_response = self.client.post(logout_url)
        self.assertEqual(logout_response.status_code, status.HTTP_401_UNAUTHORIZED)