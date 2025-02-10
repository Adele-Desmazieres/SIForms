from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SIModelViewSet

router = DefaultRouter()
router.register(r'', SIModelViewSet, basename='simodel')  # Prefix for ViewSet URLs

urlpatterns = [
    path('', include(router.urls)),  # Include router URLs at the root
]