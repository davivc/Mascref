# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_account_subdomain'),
    ]

    operations = [
        migrations.AlterField(
            model_name='account',
            name='subdomain',
            field=models.CharField(unique=True, max_length=30),
        ),
    ]
