# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_auto_20160908_0414'),
        ('reefcheck', '0002_auto_20160908_0559'),
    ]

    operations = [
        migrations.AddField(
            model_name='transect',
            name='created_by',
            field=models.ForeignKey(blank=True, to='app.UserProfile', null=True),
        ),
    ]
