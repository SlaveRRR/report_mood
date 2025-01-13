from django.contrib import admin
from .models import *


@admin.register(CustomUser)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username',)

