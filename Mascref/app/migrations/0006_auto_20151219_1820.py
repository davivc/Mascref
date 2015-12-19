# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_project_parent'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='project',
            options={'ordering': ('name',)},
        ),
        migrations.AlterModelOptions(
            name='survey',
            options={'ordering': ('name',)},
        ),
        migrations.AddField(
            model_name='survey',
            name='name',
            field=models.CharField(default=datetime.datetime(2015, 12, 19, 8, 20, 14, 521000, tzinfo=utc), max_length=150),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='survey',
            name='owner',
            field=models.ForeignKey(blank=True, to='app.Researcher', null=True),
        ),
        migrations.AddField(
            model_name='survey',
            name='public',
            field=models.BooleanField(default=False),
        ),
    ]
