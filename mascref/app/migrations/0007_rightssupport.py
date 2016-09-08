# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_auto_20160908_0414'),
    ]

    operations = [
        migrations.CreateModel(
            name='RightsSupport',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
            options={
                'managed': False,
                'permissions': (('view_admin_dashboard', 'Can view admin dashboard'), ('view_admin_maps', 'Can view admin maps'), ('view_admin_stats', 'Can view admin stats'), ('view_admin_settings', 'Can view admin settings')),
            },
        ),
    ]
