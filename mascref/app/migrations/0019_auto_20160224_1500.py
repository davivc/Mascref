# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0018_transect_members'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='group',
            name='category',
        ),
        migrations.RemoveField(
            model_name='group',
            name='parent',
        ),
        migrations.RemoveField(
            model_name='group',
            name='set',
        ),
        migrations.RemoveField(
            model_name='group',
            name='type',
        ),
        migrations.RemoveField(
            model_name='group_category',
            name='type',
        ),
        migrations.RemoveField(
            model_name='segment',
            name='group',
        ),
        migrations.RemoveField(
            model_name='segment',
            name='transect',
        ),
        migrations.RemoveField(
            model_name='segment',
            name='type',
        ),
        migrations.RemoveField(
            model_name='transect',
            name='members',
        ),
        migrations.RemoveField(
            model_name='transect',
            name='site',
        ),
        migrations.RemoveField(
            model_name='transect',
            name='survey',
        ),
        migrations.RemoveField(
            model_name='transect',
            name='team_leader',
        ),
        migrations.RemoveField(
            model_name='transect_info',
            name='transect',
        ),
        migrations.AlterModelOptions(
            name='country',
            options={'ordering': ('name',), 'verbose_name_plural': 'countries'},
        ),
        migrations.RemoveField(
            model_name='project',
            name='groups',
        ),
        migrations.AlterField(
            model_name='province',
            name='country',
            field=models.ForeignKey(related_name='provinces', to='app.Country'),
        ),
        migrations.AlterField(
            model_name='site',
            name='town',
            field=models.ForeignKey(related_name='sites', blank=True, to='app.Town', null=True),
        ),
        migrations.AlterField(
            model_name='town',
            name='country',
            field=models.ForeignKey(related_name='towns', to='app.Country'),
        ),
        migrations.AlterField(
            model_name='town',
            name='province',
            field=models.ForeignKey(related_name='towns', blank=True, to='app.Province', null=True),
        ),
        migrations.DeleteModel(
            name='Group',
        ),
        migrations.DeleteModel(
            name='Group_Category',
        ),
        migrations.DeleteModel(
            name='Group_Set',
        ),
        migrations.DeleteModel(
            name='Segment',
        ),
        migrations.DeleteModel(
            name='Transect',
        ),
        migrations.DeleteModel(
            name='Transect_Info',
        ),
        migrations.DeleteModel(
            name='Transect_Type',
        ),
    ]
