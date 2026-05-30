from django.db import models
from django.conf import settings
from messages_app.models import Compliment


class Reaction(models.Model):
    REACTION_CHOICES = [
        ('like', '👍 Like'),
        ('heart', '❤️ Heart'),
        ('fire', '🔥 Fire'),
        ('star', '⭐ Star'),
        ('hug', '🤗 Hug'),
    ]

    compliment = models.ForeignKey(
        Compliment, on_delete=models.CASCADE, related_name='reactions'
    )
    reactor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='reactions_given'
    )
    reaction_type = models.CharField(max_length=10, choices=REACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # One reaction type per user (or anonymous session) per compliment
        unique_together = ('compliment', 'reactor', 'reaction_type')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.reaction_type} on compliment #{self.compliment.id}'


class Reply(models.Model):
    """Anonymous reply to a compliment (owner of compliment can reply)."""
    compliment = models.ForeignKey(
        Compliment, on_delete=models.CASCADE, related_name='replies'
    )
    content = models.TextField(max_length=500)
    is_from_recipient = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'Reply on compliment #{self.compliment.id}'
