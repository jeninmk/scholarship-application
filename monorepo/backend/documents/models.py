from django.db import models
from accounts.models import MyUser

def upload_to(instance, filename):
    return f"documents/user_{instance.user.id}/{filename}"

class Document(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE)
    file = models.FileField(upload_to=upload_to)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.file.name}"