# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_project_confidence'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='project',
            options={'ordering': ('name',), 'permissions': (('view_admin_project', 'Can go to admin project'), ('view_project', 'Can see available projects'))},
        ),
        migrations.AlterModelOptions(
            name='survey',
            options={'ordering': ('name',), 'permissions': (('view_admin_survey', 'Can go to admin survey'), ('view_survey', 'Can see available surveys'))},
        ),
    ]
