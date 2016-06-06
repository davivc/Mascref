# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0017_auto_20160216_1351'),
    ]

    operations = [
        migrations.AddField(
            model_name='transect',
            name='members',
            field=models.ManyToManyField(related_name='members', null=True, to='app.Researcher', blank=True),
        ),
    ]
