from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
SchemaView = get_schema_view(
    openapi.Info(
        title="report_mood API",
        default_version="v1",
        description="Приложение для создания отчетов настроения",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="vyacheslav1410@yandex.ru"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('authenticate.urls')),
    path('', include('report.urls')),
    path("swagger/",
        SchemaView.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
]
