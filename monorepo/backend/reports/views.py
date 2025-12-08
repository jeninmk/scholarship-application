import csv
from django.http import HttpResponse
from django.views import View
from django.contrib.auth import get_user_model

from scholarships.models import Scholarship
from applications.models import Application

User = get_user_model()

def _write_csv_response(filename, header, rows):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    writer = csv.writer(response)
    writer.writerow(header)
    for row in rows:
        writer.writerow(row)
    return response

class AvailableScholarshipReportView(View):
    def get(self, request):
        qs = Scholarship.objects.filter(is_active=True)
        header = [
            'Name','Amount','Donor','Donor Phone','Donor Email',
            'Num Available','Required Majors','Required GPA','Deadline','Other Requirements'
        ]
        rows = []
        for s in qs:
            donor = User.objects.filter(id=s.donor_id).first()
            rows.append([
                s.name, s.amount,
                f"{donor.first_name} {donor.last_name}" if donor else '',
                donor.phone if donor else '',
                donor.email if donor else '',
                getattr(s, 'quantity', ''),            # adjust if you have a field
                s.allowed_major, s.min_gpa, s.deadline, s.description
            ])
        return _write_csv_response('available_scholarships.csv', header, rows)

class ArchivedScholarshipReportView(View):
    def get(self, request):
        qs = Scholarship.objects.filter(is_active=False)
        header = [
            'Name','Amount','Donor','Donor Phone','Donor Email',
            'Num Available','Required Majors','Required GPA','Deadline','Other Requirements'
        ]
        rows = []
        for s in qs:
            donor = User.objects.filter(id=s.donor_id).first()
            rows.append([
                s.name, s.amount,
                f"{donor.first_name} {donor.last_name}" if donor else '',
                donor.phone if donor else '',
                donor.email if donor else '',
                getattr(s, 'quantity', ''), s.allowed_major,
                s.min_gpa, s.deadline, s.description
            ])
        return _write_csv_response('archived_scholarships.csv', header, rows)

class ApplicantReportView(View):
    def get(self, request):
        apps = Application.objects.all()
        header = [
            'Full Name','Pronoun','Student ID','Major','Minor',
            'GPA','Current Year','Ethnicity','Essay','Work Experience'
        ]
        rows = []
        for a in apps:
            data = a.data
            user = a.applicant
            rows.append([
                f"{user.first_name} {user.last_name}",
                data.get('pronoun',''),
                data.get('student_id',''),
                data.get('major',''),
                data.get('minor',''),
                data.get('gpa',''),
                data.get('year',''),
                data.get('ethnicity',''),
                data.get('personal_statement',''),
                data.get('work_experience','')
            ])
        return _write_csv_response('scholarship_applicants.csv', header, rows)

class AwardedScholarshipReportView(View):
    def get(self, request):
        apps = Application.objects.filter(awarded=True)
        header = [
            'Scholarship','Amount','Awardee Name','Awardee NetID',
            'Awardee Major','Awardee GPA','Awardee Ethnicity','Awardee Email'
        ]
        rows = []
        for a in apps:
            s = a.scholarship
            u = a.applicant
            rows.append([
                s.name, s.amount,
                f"{u.first_name} {u.last_name}", u.net_id,
                u.major or '', u.gpa or '',
                a.data.get('ethnicity',''), u.email
            ])
        return _write_csv_response('awarded_scholarships.csv', header, rows)

class DemographicsReportView(View):
    def get(self, request):
        apps = Application.objects.all()
        header = [
            'Full Name','Pronoun','Student ID','Major','Minor',
            'GPA','Current Year','Ethnicity','Essay','Work Experience'
        ]
        rows = []
        for a in apps:
            data = a.data
            u = a.applicant
            rows.append([
                f"{u.first_name} {u.last_name}",
                data.get('pronoun',''),
                data.get('student_id',''),
                data.get('major',''),
                data.get('minor',''),
                u.gpa or data.get('gpa',''),
                data.get('year',''),
                data.get('ethnicity',''),
                data.get('personal_statement',''),
                data.get('work_experience','')
            ])
        return _write_csv_response('student_demographics.csv', header, rows)

class ActiveDonorReportView(View):
    def get(self, request):
        qs = Scholarship.objects.filter(is_active=True)
        header = [
            'Donor','Donor Phone','Donor Email',
            'Scholarship','Amount','Num Available',
            'Required Majors','Required GPA','Deadline'
        ]
        rows = []
        for s in qs:
            donor = User.objects.filter(id=s.donor_id).first()
            rows.append([
                f"{donor.first_name} {donor.last_name}" if donor else '',
                donor.phone if donor else '',
                donor.email if donor else '',
                s.name, s.amount,
                getattr(s, 'quantity', ''),
                s.allowed_major, s.min_gpa, s.deadline
            ])
        return _write_csv_response('active_donors.csv', header, rows)