from rest_framework import serializers
from .models import Application
from scholarships.models import Scholarship
from scholarships.serializers import ScholarshipSerializer

class ApplicationSerializer(serializers.ModelSerializer):
    # For reading: nested scholarship details
    scholarship = ScholarshipSerializer(read_only=True)
    # For writing: we accept an integer "scholarship_id" from the client
    scholarship_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Application
        fields = [
            "id",
            "applicant",
            "scholarship",
            "scholarship_id",  # new field for input
            "data",
            "submitted_at",
            "favorited_by_donor",
        ]
        extra_kwargs = {
            "applicant": {"read_only": True},
        }

    def create(self, validated_data):
        scholarship_id = validated_data.pop("scholarship_id")
        # Look up the actual Scholarship record
        try:
            scholarship = Scholarship.objects.get(pk=scholarship_id)
        except Scholarship.DoesNotExist:
            raise serializers.ValidationError(
                {"scholarship_id": "Scholarship with this ID does not exist."}
            )
        # Create Application with the correct Scholarship
        application = Application.objects.create(
            scholarship=scholarship,
            **validated_data
        )
        return application