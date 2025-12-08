from django.contrib import admin
from .models import Scholarship

@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'amount', 'deadline')  # Adjust fields as needed

