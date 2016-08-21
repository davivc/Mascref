# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_remove_account_domain'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='subdomain',
            field=models.CharField(max_length=30, null=True, blank=True),
        ),
    ]
