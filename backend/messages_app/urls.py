from django.urls import path
from .views import SendComplimentView, InboxView, ComplimentDetailView, InboxStatsView

urlpatterns = [
    path('send/<uuid:share_id>/', SendComplimentView.as_view(), name='send-compliment'),
    path('inbox/', InboxView.as_view(), name='inbox'),
    path('stats/', InboxStatsView.as_view(), name='inbox-stats'),
    path('<int:pk>/', ComplimentDetailView.as_view(), name='compliment-detail'),
]
