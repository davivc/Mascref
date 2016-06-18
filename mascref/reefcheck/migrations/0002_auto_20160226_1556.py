# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reefcheck', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='groupcategory',
            options={'ordering': ('name',), 'verbose_name_plural': 'group categories'},
        ),
        migrations.AlterModelOptions(
            name='transecttype',
            options={'ordering': ('name',)},
        ),
        migrations.AddField(
            model_name='transect',
            name='time_end',
            field=models.TimeField(null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='groupcategory',
            name='type',
            field=models.ForeignKey(to='reefcheck.TransectType'),
        ),
    ]
