# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0014_auto_20160206_1824'),
    ]

    operations = [
        migrations.CreateModel(
            name='Group_Set',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.RemoveField(
            model_name='transect_researchers',
            name='researcher',
        ),
        migrations.RemoveField(
            model_name='transect_researchers',
            name='transect',
        ),
        migrations.AddField(
            model_name='project',
            name='groups',
            field=models.ManyToManyField(to='app.Group'),
        ),
        migrations.DeleteModel(
            name='Transect_Researchers',
        ),
    ]
