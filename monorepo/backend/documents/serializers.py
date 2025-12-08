from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = "__all__"
        extra_kwargs = {
            'user': {'read_only': True}  # Mark the user field as read-only.
        }