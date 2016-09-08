# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('reefcheck', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='transect',
            options={'permissions': (('view_transect', 'Can see available transects'),)},
        ),
    ]
