from django.core.management.base import BaseCommand
from accounts.models import MyUser

class Command(BaseCommand):
    help = "Creates 6 new users with pending roles (2 admin, 2 reviewer, 2 donor)."

    def handle(self, *args, **options):
        # List of 6 users with requested_role set accordingly
        pending_users_data = [
            {
                "username": "pending_admin1",
                "password": "pass_admin1",
                "email": "pending_admin1@example.com",
                "first_name": "Admin1",
                "last_name": "User",
                "requested_role": "admin",
            },
            {
                "username": "pending_admin2",
                "password": "pass_admin2",
                "email": "pending_admin2@example.com",
                "first_name": "Admin2",
                "last_name": "User",
                "requested_role": "admin",
            },
            {
                "username": "pending_reviewer1",
                "password": "pass_reviewer1",
                "email": "pending_reviewer1@example.com",
                "first_name": "Reviewer1",
                "last_name": "User",
                "requested_role": "reviewer",
            },
            {
                "username": "pending_reviewer2",
                "password": "pass_reviewer2",
                "email": "pending_reviewer2@example.com",
                "first_name": "Reviewer2",
                "last_name": "User",
                "requested_role": "reviewer",
            },
            {
                "username": "pending_donor1",
                "password": "pass_donor1",
                "email": "pending_donor1@example.com",
                "first_name": "Donor1",
                "last_name": "User",
                "requested_role": "donor",
            },
            {
                "username": "pending_donor2",
                "password": "pass_donor2",
                "email": "pending_donor2@example.com",
                "first_name": "Donor2",
                "last_name": "User",
                "requested_role": "donor",
            },
        ]

        created_count = 0
        for user_data in pending_users_data:
            username = user_data["username"]
            if MyUser.objects.filter(username=username).exists():
                self.stdout.write(self.style.WARNING(f"User '{username}' already exists. Skipping."))
                continue

            # Create the user with role="applicant" but role_approved=False
            user = MyUser.objects.create_user(
                username=user_data["username"],
                password=user_data["password"],
                email=user_data["email"],
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                # Actual role is still "applicant" (unapproved)
                role="applicant",
                requested_role=user_data["requested_role"],
                role_approved=False,  # Mark as pending
            )

            created_count += 1
            self.stdout.write(self.style.SUCCESS(f"Created user: {user.username}"))

        self.stdout.write(self.style.SUCCESS(f"✅ Total new pending users created: {created_count}"))