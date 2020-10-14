from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    date = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        app_label = 'blog'
        managed = False
        db_table = 'auth_user'

class GlobalSettingsTelegramuser(models.Model):
    user_id = models.CharField(max_length=50, blank=True, null=True)
    label = models.CharField(max_length=50, blank=True, null=True)
    username = models.ForeignKey(AuthUser, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        app_label = 'blog'
        managed = False
        db_table = 'global_settings_telegramuser'

    def __str__(self):
        return self.username


class ConfigUser(models.Model):
    company = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    telegram_user = models.ForeignKey('GlobalSettingsTelegramuser', models.DO_NOTHING, blank=True, null=True)
    username = models.ForeignKey(AuthUser, models.DO_NOTHING, unique=True)
    alert_enabled = models.BooleanField(blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    fullname = models.CharField(max_length=100, blank=True, null=True)
    report_enabled = models.BooleanField()
    send_channel = models.BooleanField()
    send_user = models.BooleanField()
    level = models.CharField(max_length=20, blank=True, null=True)
    raw_data_permit = models.BooleanField(blank=True, null=True, default=False)
    alarm_permit = models.BooleanField(blank=True, null=True, default=False)
    map_permit = models.BooleanField(blank=True, null=True, default=False)
    logo = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        app_label = 'blog'
        managed = False
        db_table = 'config_user'
