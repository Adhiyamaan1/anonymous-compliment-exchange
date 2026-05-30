from django.urls import path
from .views import (
    AdminComplimentListView, AdminFlagComplimentView, AdminDeleteComplimentView,
    AdminUserListView, AdminToggleUserActiveView, AdminStatsView
)

urlpatterns = [
    path('stats/', AdminStatsView.as_view(), name='admin-stats'),
    path('messages/', AdminComplimentListView.as_view(), name='admin-messages'),
    path('messages/<int:pk>/flag/', AdminFlagComplimentView.as_view(), name='admin-flag'),
    path('messages/<int:pk>/delete/', AdminDeleteComplimentView.as_view(), name='admin-delete'),
    path('users/', AdminUserListView.as_view(), name='admin-users'),
    path('users/<int:pk>/toggle/', AdminToggleUserActiveView.as_view(), name='admin-toggle-user'),
]
