from django.contrib import admin
from .models import Compliment

@admin.register(Compliment)
class ComplimentAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'category', 'is_flagged', 'is_deleted', 'created_at')
    list_filter = ('category', 'is_flagged', 'is_deleted')
    search_fields = ('content', 'recipient__username')
