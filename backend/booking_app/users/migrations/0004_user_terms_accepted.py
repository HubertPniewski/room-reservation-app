# Generated by Django 5.2.4 on 2025-07-15 16:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_user_profile_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='terms_accepted',
            field=models.BooleanField(default=False),
        ),
    ]
