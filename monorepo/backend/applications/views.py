# This file contains the models for the accounts app, including a custom user model
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Application, MatchResult
from .serializers import ApplicationSerializer
from .matching import match_applications_to_scholarships
from scholarships.models import Scholarship

# 1) Import the custom permission
from .permissions import IsApplicantOrAdmin


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    queryset = Application.objects.all()

    # 2) Use our custom permission (remove or comment out the old get_permissions method).
    permission_classes = [IsApplicantOrAdmin]

    def get_queryset(self):
        qs = Application.objects.all()
        # Filter by scholarship if provided.
        scholarship = self.request.query_params.get("scholarship")
        if scholarship:
            try:
                qs = qs.filter(scholarship_id=int(scholarship))
            except ValueError:
                pass
        # Filter by application response field (assume stored in 'data')
        field = self.request.query_params.get("field")
        value = self.request.query_params.get("value")
        if field and value:
            qs = qs.filter(data__contains={field: value})
        return qs

    def perform_create(self, serializer):
        # The newly created application is tied to the current user as the applicant
        serializer.save(applicant=self.request.user)

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        """
        Toggle the favorite status for an application.
        Expects JSON: { "favorite": true } or { "favorite": false }.
        """
        application = self.get_object()
        favorite = request.data.get("favorite")
        if favorite is None:
            return Response({"error": "Missing 'favorite' field."},
                            status=status.HTTP_400_BAD_REQUEST)
        # Convert input to boolean
        if isinstance(favorite, str):
            favorite_bool = favorite.lower() == "true"
        else:
            favorite_bool = bool(favorite)

        application.favorited_by_donor = favorite_bool
        application.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ApplicationMatchingView(APIView):
    """
    For a given application (by ID), runs the matching algorithm across all scholarships 
    and stores the results in MatchResult.
    """
    def post(self, request, application_id):
        try:
            application = Application.objects.get(id=application_id)
        except Application.DoesNotExist:
            return Response({"error": "Application not found."},
                            status=status.HTTP_404_NOT_FOUND)
        
        scholarships = Scholarship.objects.all()
        match_results = match_applications_to_scholarships(application, scholarships)
        
        for match in match_results:
            MatchResult.objects.create(
                application=application,
                scholarship_id=match['scholarship_id'],
                score=match['score']
            )
        return Response({"matches": match_results}, status=status.HTTP_200_OK)