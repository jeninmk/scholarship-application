from django.urls import path
from .views import DocumentUploadView, DocumentListView, DocumentDetailView, download_document

urlpatterns = [
    path('upload/', DocumentUploadView.as_view(), name='document_upload'),
    path('', DocumentListView.as_view(), name='document_list'),
    path('<int:pk>/', DocumentDetailView.as_view(), name='document_detail'),
    path('download/<int:pk>/', download_document, name='document_download'),
]