# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.utils.timezone import utc
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 10, 14, 44, 37, 828000, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='project',
            name='created_by',
            field=models.ForeignKey(blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='project',
            name='owner',
            field=models.ForeignKey(blank=True, to='app.Researcher', null=True),
        ),
        migrations.AddField(
            model_name='project',
            name='updated_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 10, 14, 45, 5, 172000, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='researcher',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 10, 14, 45, 9, 958000, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='researcher',
            name='updated_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 10, 14, 45, 15, 420000, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='segment',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 10, 14, 45, 19, 814000, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='segment',
            name='updated_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 10, 14, 45, 27, 543000, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='site',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 10, 14, 45, 32, 260000, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='site',
            name='updated_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 10, 14, 45, 37, 874000, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='survey',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 10, 14, 45, 46, 851000, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='survey',
            name='created_by',
            field=models.ForeignKey(blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AddField(
            model_name='survey',
            name='updated_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 10, 14, 45, 53, 672000, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='transect',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 10, 14, 45, 59, 640000, tzinfo=utc), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='transect',
            name='updated_at',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 10, 14, 46, 4, 333000, tzinfo=utc), auto_now=True),
            preserve_default=False,
        ),
    ]
