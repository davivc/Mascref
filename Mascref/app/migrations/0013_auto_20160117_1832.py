# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0012_auto_20160112_1152'),
    ]

    operations = [
        migrations.AlterField(
            model_name='survey',
            name='project',
            field=models.ForeignKey(related_name='surveys', to='app.Project'),
        ),
        migrations.AlterField(
            model_name='transect',
            name='survey',
            field=models.ForeignKey(related_name='transects', to='app.Survey'),
        ),
    ]
