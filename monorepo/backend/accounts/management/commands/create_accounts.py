from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates actual accounts: admin, donor_new, and student_new'

    def handle(self, *args, **kwargs):
        # Create the admin user
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(
                username="admin",
                password="adminpass",
                email="admin@example.com"
            )
            self.stdout.write(self.style.SUCCESS("Created admin user: admin"))
        else:
            self.stdout.write(self.style.WARNING("Admin user already exists."))

        # Create the donor account
        if not User.objects.filter(username="donor_new").exists():
            User.objects.create_user(
                username="donor_new",
                password="donorpass",
                email="donor_new@example.com",
                role="donor",          # Make sure your custom user model has a 'role' field.
                role_approved=True     # Mark as approved.
            )
            self.stdout.write(self.style.SUCCESS("Created donor user: donor_new"))
        else:
            self.stdout.write(self.style.WARNING("Donor 'donor_new' already exists."))

        # Create the student (applicant) account
        if not User.objects.filter(username="student_new").exists():
            User.objects.create_user(
                username="student_new",
                password="studentpass",
                email="student_new@example.com",
                role="applicant",
                role_approved=True
            )
            self.stdout.write(self.style.SUCCESS("Created student user: student_new"))
        else:
            self.stdout.write(self.style.WARNING("Student 'student_new' already exists."))