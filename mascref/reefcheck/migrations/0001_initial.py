# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(null=True, blank=True)),
                ('format', models.IntegerField(default=1)),
            ],
        ),
        migrations.CreateModel(
            name='GroupCategory',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(null=True, blank=True)),
            ],
            options={
                'ordering': ('name',),
                'verbose_name_plural': 'group categories',
            },
        ),
        migrations.CreateModel(
            name='GroupSet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Segment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('token', models.CharField(max_length=100, db_index=True)),
                ('segment', models.IntegerField()),
                ('value', models.IntegerField(null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('group', models.ForeignKey(blank=True, to='reefcheck.Group', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Transect',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=150)),
                ('depth', models.FloatField()),
                ('date', models.DateField(null=True, blank=True)),
                ('time_start', models.TimeField(null=True, blank=True)),
                ('time_end', models.TimeField(null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('site', models.ForeignKey(related_name='transects', to='app.Site')),
                ('survey', models.ForeignKey(related_name='transects', to='app.Survey')),
                ('team_leader', models.ForeignKey(blank=True, to='app.Researcher', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='TransectInfo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('value', models.CharField(max_length=255, null=True, blank=True)),
                ('description', models.TextField(null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('transect', models.ForeignKey(to='reefcheck.Transect')),
            ],
        ),
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
                ('transect', models.ForeignKey(to='reefcheck.Transect')),
            ],
        ),
        migrations.CreateModel(
            name='TransectType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.AddField(
            model_name='segment',
            name='transect',
            field=models.ForeignKey(to='reefcheck.Transect'),
        ),
        migrations.AddField(
            model_name='segment',
            name='type',
            field=models.ForeignKey(to='reefcheck.TransectType'),
        ),
        migrations.AddField(
            model_name='groupcategory',
            name='type',
            field=models.ForeignKey(to='reefcheck.TransectType'),
        ),
        migrations.AddField(
            model_name='group',
            name='category',
            field=models.ForeignKey(blank=True, to='reefcheck.GroupCategory', null=True),
        ),
        migrations.AddField(
            model_name='group',
            name='parent',
            field=models.ForeignKey(related_name='sub_groups', blank=True, to='reefcheck.Group', null=True),
        ),
        migrations.AddField(
            model_name='group',
            name='projects',
            field=models.ManyToManyField(to='app.Project'),
        ),
        migrations.AddField(
            model_name='group',
            name='set',
            field=models.ForeignKey(to='reefcheck.GroupSet'),
        ),
        migrations.AddField(
            model_name='group',
            name='type',
            field=models.ForeignKey(to='reefcheck.TransectType'),
        ),
    ]
