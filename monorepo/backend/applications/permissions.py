# applications/permissions.py

from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsApplicantOrAdmin(BasePermission):
    """
    Allows read-only to anyone,
    but only the applicant (owner) or an admin (staff) can write.
    """

    def has_object_permission(self, request, view, obj):
        # If it's a read-only method (GET, HEAD, OPTIONS), allow
        if request.method in SAFE_METHODS:
            return True

        # If user is admin (staff), allow
        if request.user and request.user.is_staff:
            return True

        # Otherwise, must be the applicant (owner)
        return obj.applicant_id == request.user.id