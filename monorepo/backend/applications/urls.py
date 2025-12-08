from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ApplicationViewSet, ApplicationMatchingView

router = DefaultRouter()
router.register(r'applications', ApplicationViewSet, basename='application')

urlpatterns = [
    path('', include(router.urls)),
    path('match/<int:application_id>/', ApplicationMatchingView.as_view(), name='application_match'),
]