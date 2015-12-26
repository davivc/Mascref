# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_auto_20151225_1903'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='format',
            field=models.IntegerField(default=1),
        ),
        migrations.AddField(
            model_name='group_category',
            name='type',
            field=models.ForeignKey(default=1, to='app.Transect_Type'),
        ),
        migrations.AddField(
            model_name='researcher',
            name='eco_diver',
            field=models.CharField(max_length=100, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='group',
            name='type',
            field=models.ForeignKey(default=1, to='app.Transect_Type'),
        ),
        migrations.AlterField(
            model_name='segment',
            name='value',
            field=models.IntegerField(null=True, blank=True),
        ),
    ]
