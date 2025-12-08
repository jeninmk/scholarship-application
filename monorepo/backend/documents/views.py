from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import FileResponse, Http404
import os
from .models import Document
from .serializers import DocumentSerializer

# Create document (upload)
class DocumentUploadView(generics.CreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically assign the current authenticated user.
        serializer.save(user=self.request.user)

# List documents for the authenticated user.
class DocumentListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return only the documents belonging to the current user.
        return Document.objects.filter(user=self.request.user)

# Retrieve or delete a document.
class DocumentDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure a user can only retrieve or delete their own documents.
        return Document.objects.filter(user=self.request.user)

# Custom view to force file download.
def download_document(request, pk):
    if not request.user.is_authenticated:
        raise Http404("User not authenticated")
    try:
        document = Document.objects.get(pk=pk, user=request.user)
    except Document.DoesNotExist:
        raise Http404("Document not found")
    
    file_path = document.file.path
    filename = os.path.basename(file_path)
    # Force the file to download by setting as_attachment=True.
    return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=filename)