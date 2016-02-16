# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0016_auto_20160216_0925'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='groups',
            field=models.ManyToManyField(to='app.Group', null=True, blank=True),
        ),
    ]
