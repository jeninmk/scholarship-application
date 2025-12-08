from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from accounts.models import MyUser
from .models import Scholarship

class ScholarshipsTestCase(APITestCase):
    def setUp(self):
        # Create an admin user
        self.admin_user = MyUser.objects.create_superuser(
            username='admin',
            password='adminpass',
            email='admin@example.com'
        )
        # Create a normal user
        self.normal_user = MyUser.objects.create_user(
            username='student',
            password='studentpass',
            email='student@example.com'
        )
        # Create some scholarships
        self.scholarship1 = Scholarship.objects.create(
            name='Scholarship One',
            description='Desc one',
            amount=1000,
            is_active=True
        )
        self.scholarship2 = Scholarship.objects.create(
            name='Scholarship Two',
            description='Desc two',
            amount=2000,
            is_active=False
        )

    def test_list_scholarships(self):
        """Test listing scholarships (ScholarshipListView)."""
        url = '/api/scholarships/'  # If ScholarshipListView is at this route
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # The default code returns all scholarships, but might filter out is_active if you want
        self.assertGreaterEqual(len(response.data), 2)

    def test_filter_by_donor(self):
        """Test the endpoint that filters scholarships by donor_id (ScholarshipsByDonorView)."""
        # Suppose scholarship1 has donor_id=1
        self.scholarship1.donor_id = 1
        self.scholarship1.save()
        url = '/api/scholarships/donor/1/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'Scholarship One')

    def test_viewset_create_scholarship(self):
        """If you have a ScholarshipViewSet, test creating via the router path."""
        self.client.login(username='admin', password='adminpass')
        url = '/api/scholarships/api/viewset/'  # from router: 'api/' + 'viewset/'
        data = {
            'name': 'New Scholarship',
            'description': 'Testing create',
            'amount': 3000,
            'is_active': True
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Scholarship.objects.filter(name='New Scholarship').exists())