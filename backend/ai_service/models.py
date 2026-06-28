from django.db import models

class UserInjection(models.Model):
    user_email = models.EmailField(db_index=True)
    topic_slug = models.CharField(max_length=255)
    history = models.JSONField(default=list, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user_email', 'topic_slug')
