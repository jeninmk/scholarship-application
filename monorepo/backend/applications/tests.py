from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import MyUser
from scholarships.models import Scholarship
from .models import Application

class ApplicationsTestCase(APITestCase):
    def setUp(self):
        # Create a user
        self.user = MyUser.objects.create_user(
            username='applicant',
            password='applicantpass',
            email='applicant@example.com'
        )
        # Create a scholarship. Provide a deadline if required.
        self.scholarship = Scholarship.objects.create(
            name='Test Scholarship',
            description='A test scholarship',
            amount=5000,
            deadline='2025-12-31',
            is_active=True,
            donor_id=None  # This field exists now after migration
        )
        # Log in
        self.client.login(username='applicant', password='applicantpass')

    def test_create_application(self):
        """Test creating a new application."""
        url = '/api/applications/applications/'  # From DefaultRouter
        data = {
            'scholarship_id': self.scholarship.id,
            'data': {
                'essay': 'This is my essay text.',
                'gpa': 3.5
            }
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Application.objects.filter(applicant=self.user).exists())

    def test_filter_by_scholarship(self):
        """Test filtering applications by scholarship ID."""
        # Create an application
        Application.objects.create(
            applicant=self.user,
            scholarship=self.scholarship,
            data={'essay': 'some text'}
        )
        # GET with query param
        url = '/api/applications/applications/?scholarship={}'.format(self.scholarship.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)


    def test_update_application(self):
        """Test modifying an existing application."""
        app = Application.objects.create(
            applicant=self.user,
            scholarship=self.scholarship,
            data={'essay': 'old text'}
        )
        url = f'/api/applications/applications/{app.id}/'
        update_data = {
            'scholarship_id': self.scholarship.id,
            'data': {'essay': 'updated text'}
        }
        response = self.client.put(url, update_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        app.refresh_from_db()
        self.assertEqual(app.data['essay'], 'updated text')