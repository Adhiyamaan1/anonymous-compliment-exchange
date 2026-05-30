from django.urls import path
from .views import ReactView, ReplyView

urlpatterns = [
    path('<int:pk>/react/', ReactView.as_view(), name='compliment-react'),
    path('<int:pk>/replies/', ReplyView.as_view(), name='compliment-replies'),
]
