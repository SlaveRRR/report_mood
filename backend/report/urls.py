from django.urls import path, include
from rest_framework import routers
from .views import SurveyViewSet



router = routers.DefaultRouter()
router.register(r'surveys', SurveyViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]