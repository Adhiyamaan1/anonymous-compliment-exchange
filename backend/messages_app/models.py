from django.db import models
from django.conf import settings


class Compliment(models.Model):
    CATEGORY_CHOICES = [
        ('kindness', 'Kindness'),
        ('humor', 'Humor'),
        ('intelligence', 'Intelligence'),
        ('creativity', 'Creativity'),
        ('leadership', 'Leadership'),
        ('support', 'Support'),
        ('general', 'General'),
    ]

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_compliments'
    )
    # Sender is always anonymous - we store the user if logged in but never reveal
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='sent_compliments',
        null=True,
        blank=True
    )
    content = models.TextField(max_length=1000)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    is_flagged = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Compliment to {self.recipient.username} [{self.category}]'

    @property
    def reaction_count(self):
        return self.reactions.count()
