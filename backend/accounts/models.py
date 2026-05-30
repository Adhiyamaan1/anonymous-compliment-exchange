import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    share_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    bio = models.TextField(blank=True, default='')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_accepting_messages = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

    @property
    def compliments_received(self):
        return self.received_compliments.filter(is_deleted=False).count()

    @property
    def compliments_sent(self):
        return self.sent_compliments.filter(is_deleted=False).count()
