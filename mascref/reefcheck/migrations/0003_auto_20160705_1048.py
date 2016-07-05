# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0019_auto_20160224_1500'),
        ('reefcheck', '0002_auto_20160226_1556'),
    ]

    operations = [
        migrations.CreateModel(
            name='TransectMemberRole',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='TransectMembers',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('researcher', models.ForeignKey(to='app.Researcher')),
                ('role', models.ForeignKey(to='reefcheck.TransectMemberRole')),
            ],
        ),
        migrations.RemoveField(
            model_name='transect',
            name='members',
        ),
        migrations.AddField(
            model_name='transectmembers',
            name='transect',
            field=models.ForeignKey(to='reefcheck.Transect'),
        ),
    ]
