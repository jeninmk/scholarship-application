from django.urls import path
from .views import (
    AvailableScholarshipReportView,
    ArchivedScholarshipReportView,
    ApplicantReportView,
    AwardedScholarshipReportView,
    DemographicsReportView,
    ActiveDonorReportView,
)

urlpatterns = [
    path('available/', AvailableScholarshipReportView.as_view(), name='report-available'),
    path('archived/', ArchivedScholarshipReportView.as_view(), name='report-archived'),
    path('applicants/', ApplicantReportView.as_view(), name='report-applicants'),
    path('awarded/', AwardedScholarshipReportView.as_view(), name='report-awarded'),
    path('demographics/', DemographicsReportView.as_view(), name='report-demographics'),
    path('active-donors/', ActiveDonorReportView.as_view(), name='report-active-donors'),
]