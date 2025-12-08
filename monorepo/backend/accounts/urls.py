

from django.urls import path
from .views import (
    CreateUserView,
    LoginView,
    UnlockAccountView,
    LockAccountView,
    SetPasswordView,
    ChangePasswordView,
    RoleRequestListView,
    RoleUpdateView,
    PendingRoleRequestsCountView,
    LockedUsersCountView,
    UserListView,
    UserDetailView,
    UserUpdateView,
    UserChangeHistoryView,
    current_user,  # Endpoint for current user details.
)

urlpatterns = [
    path('create/', CreateUserView.as_view(), name='create_user'),
    path('login/', LoginView.as_view(), name='login'),
    path('unlock/<int:user_id>/', UnlockAccountView.as_view(), name='unlock_account'),
    path('lock/<int:user_id>/', LockAccountView.as_view(), name='lock_account'),
    path('password/set/', SetPasswordView.as_view(), name='set_password'),
    path('password/change/', ChangePasswordView.as_view(), name='change_password'),
    path('role-requests/', RoleRequestListView.as_view(), name='role_requests'),
    path('role-update/<int:id>/', RoleUpdateView.as_view(), name='role_update'),
    path('role-requests/count/', PendingRoleRequestsCountView.as_view(), name='role_requests_count'),
    path('locked-users/count/', LockedUsersCountView.as_view(), name='locked_users_count'),
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('users/<int:pk>/update/', UserUpdateView.as_view(), name='user-update'),
    path('users/<int:pk>/history/', UserChangeHistoryView.as_view(), name='user-history'),
    path('me/', current_user, name='current_user'),
]