# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_auto_20151222_2347'),
    ]

    operations = [
        migrations.AlterField(
            model_name='group',
            name='parent',
            field=models.ForeignKey(related_name='sub_groups', blank=True, to='app.Group', null=True),
        ),
    ]
