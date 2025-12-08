# scholarships/views.py
from rest_framework import generics, viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg
from django.shortcuts import get_object_or_404
from .models import Scholarship
from .serializers import ScholarshipSerializer

# List all scholarships or create a new one (only admins can create)
class ScholarshipListCreate(generics.ListCreateAPIView):
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        # Ensure only staff (admin) can create scholarships
        if not self.request.user.is_staff:
            raise PermissionError("Only admins can add scholarships.")
        # Now we let the front-end specify donor_id (or any other fields).
        serializer.save()

# Retrieve, update, or delete a specific scholarship
class ScholarshipDetailUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer

    def get_permissions(self):
        # Allow read-only methods to anyone; require admin for write ops
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

# Filter scholarships by donor (active scholarships)
class ScholarshipsByDonorView(APIView):
    def get(self, request, donor_id):
        # Filter by numeric donor_id, showing only active scholarships
        qs = Scholarship.objects.filter(donor_id=donor_id, is_active=True)
        serializer = ScholarshipSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# ViewSet for additional endpoints via DRF router
class ScholarshipViewSet(viewsets.ModelViewSet):
    queryset = Scholarship.objects.all()
    serializer_class = ScholarshipSerializer
    permission_classes = [permissions.IsAuthenticated]

# Generate a report of scholarships
class ScholarshipReportView(APIView):
    def get(self, request):
        total = Scholarship.objects.count()
        avg_amount = Scholarship.objects.aggregate(avg=Avg('amount'))['avg']
        active_count = Scholarship.objects.filter(is_active=True).count()
        inactive_count = total - active_count
        report = {
            "total_scholarships": total,
            "average_amount": avg_amount,
            "active_scholarships": active_count,
            "inactive_scholarships": inactive_count,
        }
        return Response(report, status=status.HTTP_200_OK)

# Endpoint to bookmark (save) a scholarship for the current user
class BookmarkScholarshipView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        """
        Expects JSON: { "saved": true } to bookmark or { "saved": false } to remove.
        Uses the currently authenticated user.
        """
        saved = request.data.get("saved")
        if saved is None:
            return Response(
                {"error": "Missing 'saved' field."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if isinstance(saved, str):
            saved = saved.lower() == "true"
        else:
            saved = bool(saved)

        scholarship = get_object_or_404(Scholarship, pk=pk)
        user = request.user

        if saved:
            scholarship.bookmarked_by.add(user)
        else:
            scholarship.bookmarked_by.remove(user)
        scholarship.save()

        serializer = ScholarshipSerializer(scholarship)
        return Response(serializer.data, status=status.HTTP_200_OK)