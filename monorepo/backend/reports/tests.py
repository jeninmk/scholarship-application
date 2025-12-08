import csv
import io
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from scholarships.models import Scholarship
from applications.models import Application

User = get_user_model()

class ReportsTestCase(TestCase):
    def setUp(self):
        # Create donor user
        self.donor = User.objects.create_user(
            username='donor', email='donor@example.com', password='pass'
        )
        self.donor.first_name = 'Donor'
        self.donor.last_name = 'User'
        self.donor.phone = '1234567890'
        self.donor.save()

        # Active scholarship
        self.active_s = Scholarship.objects.create(
            name='ActiveScholar',
            amount=1000,
            deadline='2025-12-31',
            is_active=True,
            donor_id=self.donor.id,
            allowed_major='CS',
            min_gpa=3.0,
            description='Test active'
        )

        # Archived scholarship
        self.archived_s = Scholarship.objects.create(
            name='ArchivedScholar',
            amount=500,
            deadline='2025-06-30',
            is_active=False,
            donor_id=self.donor.id,
            allowed_major='EE',
            min_gpa=2.5,
            description='Test archived'
        )

        # Create applicant user
        self.applicant = User.objects.create_user(
            username='applicant', email='app@example.com', password='pass'
        )
        self.applicant.first_name = 'App'
        self.applicant.last_name = 'User'
        self.applicant.net_id = 'ap123'
        self.applicant.major = 'CS'
        self.applicant.gpa = 3.5
        self.applicant.save()

        # Application (not awarded)
        self.app1 = Application.objects.create(
            applicant=self.applicant,
            scholarship=self.active_s,
            data={
                'pronoun':'they',
                'student_id':'S123',
                'major':'CS',
                'minor':'Math',
                'gpa':'3.5',
                'year':'Junior',
                'ethnicity':'Hispanic',
                'personal_statement':'Essay',
                'work_experience':'Intern'
            }
        )

        # Awarded application
        self.app2 = Application.objects.create(
            applicant=self.applicant,
            scholarship=self.archived_s,
            data={'ethnicity':'Hispanic'},
            awarded=True
        )

        self.client = Client()

    def _get_rows(self, url_name):
        url = reverse(url_name)
        response = self.client.get(url)
        # Basic checks
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'text/csv')
        # Parse CSV into list of rows
        content = response.content.decode('utf-8')
        return list(csv.reader(io.StringIO(content)))

    def test_available_report(self):
        rows = self._get_rows('report-available')
        header, *data = rows
        self.assertIn('Name', header)
        # ActiveScholar present, ArchivedScholar not
        self.assertTrue(any(r[0] == 'ActiveScholar' for r in data))
        self.assertFalse(any(r[0] == 'ArchivedScholar' for r in data))

    def test_archived_report(self):
        rows = self._get_rows('report-archived')
        header, *data = rows
        self.assertTrue(any(r[0] == 'ArchivedScholar' for r in data))
        self.assertFalse(any(r[0] == 'ActiveScholar' for r in data))

    def test_applicants_report(self):
        rows = self._get_rows('report-applicants')
        header, *data = rows
        self.assertTrue(any('App User' in r[0] for r in data))

    def test_awarded_report(self):
        rows = self._get_rows('report-awarded')
        header, *data = rows
        self.assertTrue(any(r[0] == 'ArchivedScholar' for r in data))
        self.assertFalse(any(r[0] == 'ActiveScholar' for r in data))

    def test_demographics_report(self):
        rows = self._get_rows('report-demographics')
        header, *data = rows
        self.assertTrue(any('App User' in r[0] for r in data))

    def test_active_donor_report(self):
        rows = self._get_rows('report-active-donors')
        header, *data = rows
        # Should see the donor’s name
        self.assertTrue(any(self.donor.first_name in r[0] for r in data))