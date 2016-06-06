# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_auto_20151224_0946'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='segment',
            name='id',
        ),
        migrations.AddField(
            model_name='segment',
            name='token',
            field=models.CharField(default=datetime.datetime(2015, 12, 25, 9, 3, 1, 231000, tzinfo=utc), max_length=100, serialize=False, primary_key=True),
            preserve_default=False,
        ),
    ]
