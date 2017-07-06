from django.contrib import admin

from app.models import Config
from app.models import Account
from app.models import Site

admin.site.register(Config)
admin.site.register(Account)
admin.site.register(Site)

