from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User
from .forms import UserCreationForm, UserChangeForm

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('first_name', 'last_name', 'email', 'town')
    ordering = ('email',)
    search_fields = ('email', 'first_name', 'last_name')
    exclude = ('groups', 'user_permissions')

    fieldsets = (
        (None, {'fields': ('email', 'password', 'profile_image')}),
        ('Personal Data', {'fields': ('first_name', 'last_name', 'phone_number', 'address', 'town')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'phone_number', 'address', 'town', 'password1', 'password2')
        }),
    )
    
    