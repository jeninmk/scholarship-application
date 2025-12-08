from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from scholarships.models import Scholarship

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds 5 engineering scholarships for the user with username='donor_new', assigning donor_id to that user's real ID."

    def handle(self, *args, **kwargs):
        donor_new = User.objects.filter(username="donor_new").first()
        if not donor_new:
            self.stdout.write(self.style.ERROR("Donor 'donor_new' not found."))
            return

        # Delete all scholarships
        Scholarship.objects.all().delete()

        scholarships_data = [
            {
                "name": "Pioneering Engineering Excellence Award",
                "description": "Awarded to the most innovative engineering mind demonstrating groundbreaking approaches.",
                "amount": 7000,
                "deadline": date.today() + timedelta(days=90),
                "min_gpa": 3.4,
                "allowed_major": "Engineering",
            },
            {
                "name": "Advanced Technologies Scholarship",
                "description": "Recognizes achievements in forward-thinking engineering with a problem-solving focus.",
                "amount": 6500,
                "deadline": date.today() + timedelta(days=80),
                "min_gpa": 3.2,
                "allowed_major": "Engineering",
            },
            {
                "name": "Innovative Systems Design Grant",
                "description": "For students who exhibit exceptional talent creating transformative engineering solutions.",
                "amount": 6000,
                "deadline": date.today() + timedelta(days=100),
                "min_gpa": 3.3,
                "allowed_major": "Engineering",
            },
            {
                "name": "Sustainable Engineering Future Award",
                "description": "Design methods that promote energy efficiency, environmental protection, and sustainability.",
                "amount": 5500,
                "deadline": date.today() + timedelta(days=70),
                "min_gpa": 3.0,
                "allowed_major": "Engineering",
            },
            {
                "name": "Next Generation Engineering Leadership Prize",
                "description": "Rewards academic excellence in engineering, empowering future industry innovators.",
                "amount": 7200,
                "deadline": date.today() + timedelta(days=85),
                "min_gpa": 3.5,
                "allowed_major": "Engineering",
            },
        ]

        created_count = 0
        for data in scholarships_data:
            _, created = Scholarship.objects.get_or_create(
                name=data["name"],
                defaults={
                    "description": data["description"],
                    "amount": data["amount"],
                    "deadline": data["deadline"],
                    "is_active": True,
                    "donor_id": donor_new.id,
                    "min_gpa": data["min_gpa"],
                    "allowed_major": data["allowed_major"],
                },
            )
            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {created_count} scholarship(s) for donor '{donor_new.username}' (id={donor_new.id})"
            )
        )