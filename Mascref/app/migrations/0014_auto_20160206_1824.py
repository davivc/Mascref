# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app', '0013_auto_20160117_1832'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='site',
            options={'ordering': ('name',)},
        ),
        migrations.AddField(
            model_name='researcher',
            name='user',
            field=models.ForeignKey(blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
