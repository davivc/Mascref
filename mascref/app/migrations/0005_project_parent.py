# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_remove_project_parent'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='parent',
            field=models.ForeignKey(blank=True, to='app.Project', null=True),
        ),
    ]
