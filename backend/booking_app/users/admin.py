from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import User
from .forms import UserCreationForm, UserChangeForm
from listings.models import RentObject


class RentObjectInline(admin.TabularInline):
    model = RentObject
    extra = 0
    readonly_fields = ('name', 'rental_type', 'formatted_day_price_cents', 'description',)
    show_change_link = True

    @admin.display(description='Day price')
    def formatted_day_price_cents(self, obj):
        if obj.day_price_cents is not None:
            return f'{obj.day_price_cents/100:.2f} zł'
        return '-'

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm



    list_display = ('first_name', 'last_name', 'email', 'id')
    ordering = ('email',)
    search_fields = ('email', 'first_name', 'last_name')
    exclude = ('groups', 'user_permissions')

    fieldsets = (
        (None, {'fields': ('email', 'password', 'profile_image')}),
        ('Personal Data', {'fields': ('first_name', 'last_name', 'phone_number', 'date_joined', 'id',)}),
        ('Permissions', {'fields': ('terms_accepted', 'is_active', 'is_staff', 'is_superuser',)}),
    )
    readonly_fields = (
        'date_joined',
        'terms_accepted',
        'id',
    )
    inlines = [RentObjectInline]
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'phone_number', 'password1', 'password2')
        }),
    )
    
    