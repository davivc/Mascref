# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_auto_20160822_0509'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='confidence',
            field=models.ForeignKey(blank=True, to='app.DataCollectedConfidence', null=True),
        ),
    ]
