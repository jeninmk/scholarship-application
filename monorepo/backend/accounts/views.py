import logging
from django.contrib.auth import authenticate
from django.http import Http404
from django.db import transaction
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.tokens import RefreshToken

from .models import MyUser, Scholarship, UserChangeHistory
from .serializers import (
    MyUserSerializer,
    ScholarshipSerializer,
    UserUpdateSerializer,
    UserChangeHistorySerializer,
)

logger = logging.getLogger(__name__)

# Public endpoint: Create a new user.
class CreateUserView(generics.CreateAPIView):
    queryset = MyUser.objects.all()
    serializer_class = MyUserSerializer
    permission_classes = [AllowAny]

# Public endpoint: Login.
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Username and password are required'},
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            user = MyUser.objects.get(username=username)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid credentials'},
                            status=status.HTTP_400_BAD_REQUEST)
        if user.is_locked:
            return Response({'error': 'Account is locked due to too many failed login attempts.'},
                            status=status.HTTP_403_FORBIDDEN)
        user_auth = authenticate(username=username, password=password)
        if user_auth is not None and user_auth.is_active:
            user.failed_login_attempts = 0
            user.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Login successful',
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'role': user.role,
                'role_approved': user.role_approved,
            })
        else:
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= 5:
                user.is_locked = True
            user.save()
            return Response({'error': 'Invalid credentials'},
                            status=status.HTTP_400_BAD_REQUEST)

# Admin-only endpoint: Unlock a user account.
class UnlockAccountView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request, user_id):
        try:
            user = MyUser.objects.get(id=user_id)
        except MyUser.DoesNotExist:
            return Response({'error': 'User not found'},
                            status=status.HTTP_404_NOT_FOUND)
        user.is_locked = False
        user.failed_login_attempts = 0
        user.save()
        return Response({'message': 'User account has been unlocked.'})

# Admin-only endpoint: Lock a user account.
class LockAccountView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request, user_id):
        try:
            user = MyUser.objects.get(id=user_id)
        except MyUser.DoesNotExist:
            return Response({'error': 'User not found'},
                            status=status.HTTP_404_NOT_FOUND)
        user.is_locked = True
        user.failed_login_attempts = 5  # Set to threshold
        user.save()
        return Response({'message': 'User account has been locked.'})

# Protected endpoint: Set password upon first login.
class SetPasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
    def post(self, request):
        try:
            password = request.data.get("password")
            if not password:
                return Response({"error": "Password is required."},
                                status=status.HTTP_400_BAD_REQUEST)
            user = request.user
            user.set_password(password)
            user.save()
            logger.info(f"User {user.username} set password successfully.")
            return Response({"message": "Password set successfully."},
                            status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error setting password for user {request.user}: {e}")
            return Response({"error": "An error occurred while setting the password."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Protected endpoint: Change password.
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
    def post(self, request):
        try:
            old_password = request.data.get("old_password")
            new_password = request.data.get("new_password")
            user = request.user
            if not user.check_password(old_password):
                return Response({"error": "Current password is incorrect."},
                                status=status.HTTP_400_BAD_REQUEST)
            user.set_password(new_password)
            user.save()
            logger.info(f"User {user.username} changed password successfully.")
            return Response({"message": "Password updated successfully."},
                            status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error changing password for user {request.user}: {e}")
            return Response({"error": "An error occurred while changing the password."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Endpoints for role management.
class RoleRequestListView(generics.ListAPIView):
    queryset = MyUser.objects.filter(requested_role__isnull=False, role_approved=False)
    serializer_class = MyUserSerializer
    permission_classes = [permissions.IsAdminUser]

class RoleUpdateView(generics.UpdateAPIView):
    queryset = MyUser.objects.all()
    serializer_class = MyUserSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = 'id'

# Endpoints for user management.
class UserUpdateView(generics.UpdateAPIView):
    queryset = MyUser.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAdminUser]

    def get_permissions(self):
        if self.request.user.is_authenticated:
            if self.request.user.is_staff or self.get_object().id == self.request.user.id:
                return [permissions.IsAuthenticated()]
        raise PermissionDenied("You do not have permission to update this user.")

    def get_object(self):
        user_id = self.kwargs.get('pk')
        try:
            return MyUser.objects.get(id=user_id)
        except MyUser.DoesNotExist:
            raise Http404

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

class UserChangeHistoryView(generics.ListAPIView):
    serializer_class = UserChangeHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs["pk"]
        return UserChangeHistory.objects.filter(user__id=user_id).order_by("-timestamp")

class UserListView(APIView):
    def get(self, request):
        users = MyUser.objects.all()
        serializer = MyUserSerializer(users, many=True)
        return Response(serializer.data)

# Modified UserDetailView to allow DELETE.
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MyUser.objects.all()
    serializer_class = MyUserSerializer

# Endpoint: Return pending role requests count.
class PendingRoleRequestsCountView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        count = MyUser.objects.filter(requested_role__isnull=False, role_approved=False).count()
        return Response({"pendingCount": count}, status=status.HTTP_200_OK)

# Endpoint: Return locked users count.
class LockedUsersCountView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        count = MyUser.objects.filter(is_locked=True).count()
        return Response({"lockedUserCount": count}, status=status.HTTP_200_OK)
    

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Returns the currently authenticated user's details.
    """
    serializer = MyUserSerializer(request.user)
    return Response(serializer.data)