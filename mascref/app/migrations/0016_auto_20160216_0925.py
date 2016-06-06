# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0015_auto_20160216_0919'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='set',
            field=models.ForeignKey(default=1, to='app.Group_Set'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='group',
            name='type',
            field=models.ForeignKey(to='app.Transect_Type'),
        ),
    ]
