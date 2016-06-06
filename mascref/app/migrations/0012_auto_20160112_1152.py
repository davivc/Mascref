# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_transect_info'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transect',
            name='depth',
            field=models.FloatField(),
        ),
    ]
