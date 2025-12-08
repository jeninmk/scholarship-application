from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ScholarshipListCreate,
    ScholarshipDetailUpdateDelete,
    ScholarshipsByDonorView,
    ScholarshipViewSet,
    ScholarshipReportView,
    BookmarkScholarshipView,
)

router = DefaultRouter()
router.register(r'viewset', ScholarshipViewSet, basename='scholarship')

urlpatterns = [
    # List all scholarships or create a new one.
    path('', ScholarshipListCreate.as_view(), name='scholarship-list'),
    # Retrieve, update, or delete a specific scholarship.
    path('<int:pk>/', ScholarshipDetailUpdateDelete.as_view(), name='scholarship-detail'),
    # Filter scholarships by donor.
    path('donor/<int:donor_id>/', ScholarshipsByDonorView.as_view(), name='scholarship_by_donor'),
    # Generate a scholarship report.
    path('report/', ScholarshipReportView.as_view(), name='scholarship_report'),
    # Endpoint to bookmark a scholarship.
    path('<int:pk>/bookmark/', BookmarkScholarshipView.as_view(), name='bookmark_scholarship'),
    # Additional endpoints via the router.
    path('api/', include(router.urls)),
]