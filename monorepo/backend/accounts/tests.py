from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import MyUser

class AccountsTestCase(APITestCase):
    def setUp(self):
        # Create an admin user for unlocking accounts
        self.admin_user = MyUser.objects.create_superuser(
            username='admin',
            password='adminpass',
            email='admin@example.com'
        )
        # Create a normal user for testing; include all required fields.
        self.normal_user = MyUser.objects.create_user(
            username='testuser',
            password='testpass',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            phone='1234567890',
            net_id='testid',
            security_question1='What is your favorite color?',
            security_answer1='Blue',
            security_question2='What is your pet’s name?',
            security_answer2='Fluffy'
        )

    def test_create_user(self):
        """Test that we can create a new user via the /create/ endpoint."""
        url = reverse('create_user')  # from accounts/urls.py name='create_user'
        data = {
            'username': 'newuser',
            'password': 'newpass123',
            'email': 'new@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'phone': '9876543210',
            'net_id': 'newid',
            'security_question1': 'What is your favorite color?',
            'security_answer1': 'Blue',
            'security_question2': 'What is your pet’s name?',
            'security_answer2': 'Fluffy'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(MyUser.objects.filter(username='newuser').exists())

    def test_login_user_success(self):
        """Test logging in with correct credentials."""
        url = reverse('login') 
        data = {
            'username': 'testuser',
            'password': 'testpass'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)

    def test_login_user_fail(self):
        """Test login fails with wrong password."""
        url = reverse('login')
        data = {
            'username': 'testuser',
            'password': 'wrongpass'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_unlock_account(self):
        """Test that an admin can unlock a locked user."""
        # First, lock the user
        self.normal_user.is_locked = True
        self.normal_user.save()
        self.assertTrue(self.normal_user.is_locked)

        # Log in as admin
        self.client.login(username='admin', password='adminpass')
        url = reverse('unlock_account', kwargs={'user_id': self.normal_user.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.normal_user.refresh_from_db()
        self.assertFalse(self.normal_user.is_locked)

    def test_set_password(self):
        """Test that a user can set a password upon first login (assuming they're logged in)."""
        # Log in first
        self.client.login(username='testuser', password='testpass')
        url = reverse('set_password')  
        data = {'password': 'newpassword123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.normal_user.refresh_from_db()
        self.assertTrue(self.normal_user.check_password('newpassword123'))

    def test_change_password(self):
        """Test that a user can change their password with the correct old password."""
        self.client.login(username='testuser', password='testpass')
        url = reverse('change_password')  
        data = {
            'old_password': 'testpass',
            'new_password': 'changedpass123'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.normal_user.refresh_from_db()
        self.assertTrue(self.normal_user.check_password('changedpass123'))