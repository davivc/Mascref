# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_auto_20151219_1820'),
    ]

    operations = [
        migrations.AlterField(
            model_name='site',
            name='lat',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='site',
            name='long',
            field=models.FloatField(),
        ),
    ]
