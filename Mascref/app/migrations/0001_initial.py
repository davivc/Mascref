# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Config',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('value', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Country',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Group_Category',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=150)),
                ('description', models.TextField(null=True, blank=True)),
                ('parent', models.ForeignKey(blank=True, to='app.Project', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Province',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=150)),
                ('country', models.ForeignKey(to='app.Country')),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.CreateModel(
            name='Researcher',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Segment',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('segment', models.IntegerField()),
                ('value', models.IntegerField()),
                ('group', models.ForeignKey(blank=True, to='app.Group', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Site',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=150)),
                ('lat', models.IntegerField()),
                ('long', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Survey',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_start', models.DateField()),
                ('date_end', models.DateField(null=True, blank=True)),
                ('project', models.ForeignKey(to='app.Project')),
            ],
        ),
        migrations.CreateModel(
            name='Town',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=150)),
                ('country', models.ForeignKey(to='app.Country')),
                ('province', models.ForeignKey(blank=True, to='app.Province', null=True)),
            ],
            options={
                'ordering': ('name',),
            },
        ),
        migrations.CreateModel(
            name='Transect',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=150)),
                ('depth', models.IntegerField()),
                ('date', models.DateField(null=True, blank=True)),
                ('time_start', models.TimeField(null=True, blank=True)),
                ('site', models.ForeignKey(to='app.Site')),
                ('survey', models.ForeignKey(to='app.Survey')),
                ('team_leader', models.ForeignKey(blank=True, to='app.Researcher', null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Transect_Researchers',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('researcher', models.ForeignKey(to='app.Researcher')),
                ('transect', models.ForeignKey(to='app.Transect')),
            ],
        ),
        migrations.CreateModel(
            name='Transect_Type',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.AddField(
            model_name='site',
            name='town',
            field=models.ForeignKey(blank=True, to='app.Town', null=True),
        ),
        migrations.AddField(
            model_name='segment',
            name='transect',
            field=models.ForeignKey(to='app.Transect'),
        ),
        migrations.AddField(
            model_name='segment',
            name='type',
            field=models.ForeignKey(to='app.Transect_Type'),
        ),
        migrations.AddField(
            model_name='group',
            name='category',
            field=models.ForeignKey(blank=True, to='app.Group_Category', null=True),
        ),
        migrations.AddField(
            model_name='group',
            name='parent',
            field=models.ForeignKey(blank=True, to='app.Group', null=True),
        ),
        migrations.AddField(
            model_name='group',
            name='type',
            field=models.ForeignKey(to='app.Transect_Type'),
        ),
    ]
