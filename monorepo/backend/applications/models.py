from django.db import models
from accounts.models import MyUser
from scholarships.models import Scholarship

class Application(models.Model):
    applicant = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    scholarship = models.ForeignKey(Scholarship, on_delete=models.CASCADE)
    data = models.JSONField()  # Stores application details.
    submitted_at = models.DateTimeField(auto_now_add=True)
    favorited_by_donor = models.BooleanField(default=False)
    awarded = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.applicant.username} - {self.scholarship.name}"

class MatchResult(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    scholarship = models.ForeignKey(Scholarship, on_delete=models.CASCADE)
    score = models.FloatField(default=0.0)
    matched_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Application {self.application.id} -> Scholarship {self.scholarship.id} (Score: {self.score})"