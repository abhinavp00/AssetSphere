from django.contrib import admin
from .models import User,Asset,Inventory,Assignment,RepairTicket


# Register your models here.

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display =  ('username', 'email', 'role')
    list_filter = ('role',)
    search_fields = ('username',)


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    list_display = ('name','asset_type','serial_number','status','purchase_date')
    list_filter = ('status','asset_type',)
    search_fields = ('name','serial_number',)
    ordering = ('purchase_date',)


@admin.register(Inventory)
class IntventoryAdmin(admin.ModelAdmin):
    list_display = ('item_type','quantity','threshold',)
    search_fields = ('item_type',)


@admin.register(Assignment)

class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('asset','employee','date_assigned','date_return',)
    list_filter = ('date_assigned',)
    search_fields = ('asset','employee',)

@admin.register(RepairTicket)
class RepairAdmin(admin.ModelAdmin):
    list_display = ('asset','issue','status','assigned_technician',)
    list_filter = ('status',)
    search_fields = ('asset','assigend_technician',)




