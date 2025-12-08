# scholarships/models.py

from django.db import models
from django.conf import settings

class Scholarship(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    deadline = models.DateField(null=True, blank=True)  # allow null for testing
    is_active = models.BooleanField(default=True)
    quantity = models.IntegerField(null=True, blank=True)

    # Numeric field to store the donor's actual user ID
    donor_id = models.IntegerField(null=True, blank=True)

    requires_transcript = models.BooleanField(default=False)
    requires_recommendation = models.BooleanField(default=False)
    min_gpa = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    allowed_major = models.CharField(max_length=255, blank=True, default="")

    bookmarked_by = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="saved_scholarships",
        blank=True
    )

    class Meta:
        ordering = ["deadline"]

    def __str__(self):
        return self.name