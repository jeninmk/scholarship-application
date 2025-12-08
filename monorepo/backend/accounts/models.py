from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model

class MyUser(AbstractUser):
    # Custom fields for our user
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=30, blank=False)
    last_name = models.CharField(max_length=30, blank=False)
    phone = models.CharField(max_length=20, blank=True)
    net_id = models.CharField(max_length=50, blank=True)
    security_question1 = models.CharField(max_length=255, blank=True)
    security_answer1 = models.CharField(max_length=255, blank=True)
    security_question2 = models.CharField(max_length=255, blank=True)
    security_answer2 = models.CharField(max_length=255, blank=True)
    failed_login_attempts = models.IntegerField(default=0)
    is_locked = models.BooleanField(default=False)
    
    # Optional profile fields for scholarship applications
    gpa = models.FloatField(null=True, blank=True)
    major = models.CharField(max_length=100, blank=True)
    
    # Role management fields:
    ROLE_CHOICES = (
        ('applicant', 'Applicant'),
        ('reviewer', 'Reviewer'),
        ('donor', 'Donor'),
        ('admin', 'Admin'),
    )
    # The effective role (default is applicant)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='applicant')
    # The role the user requests upon signup (optional)
    requested_role = models.CharField(max_length=20, choices=ROLE_CHOICES, blank=True, null=True,)
    # Whether the requested role has been approved
    role_approved = models.BooleanField(default=False)
    
    def __str__(self):
        return self.username

# Scholarship model
class Scholarship(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    eligibility_criteria = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.name

# New model to track changes to user fields
MyUserModel = get_user_model()

class UserChangeHistory(models.Model):
    user = models.ForeignKey(MyUserModel, on_delete=models.CASCADE, related_name="change_history")
    field_name = models.CharField(max_length=255)
    old_value = models.TextField(blank=True, null=True)
    new_value = models.TextField(blank=True, null=True)
    changed_by = models.ForeignKey(
        MyUserModel,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="admin_changes"
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Change for {self.user.username} - {self.field_name}"