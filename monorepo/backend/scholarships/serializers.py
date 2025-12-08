from rest_framework import serializers
from .models import Scholarship

class ScholarshipSerializer(serializers.ModelSerializer):
    bookmark_count = serializers.IntegerField(source='bookmarked_by.count', read_only=True)
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Scholarship
        fields = '__all__'  # You may list fields explicitly if preferred

    def get_is_bookmarked(self, obj):
        # Ensure we have access to the request in serializer context
        request = self.context.get("request")
        if request and request.user and request.user.is_authenticated:
            return request.user in obj.bookmarked_by.all()
        return False