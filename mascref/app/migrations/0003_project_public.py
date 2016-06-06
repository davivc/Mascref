# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_auto_20151211_0046'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='public',
            field=models.BooleanField(default=False),
        ),
    ]
