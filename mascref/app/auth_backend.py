from django.contrib.auth.backends import ModelBackend
from django.contrib.sites.models import Site
# from django.contrib.sites.models import get_current_site
# from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.models import User
from django.contrib.sites.requests import RequestSite
# from mascref.middlewares import ThreadLocal
    
    # Get the current request object:

class SiteBackend(ModelBackend):
    def authenticate(self, **credentials):
        user_or_none = super(SiteBackend, self).authenticate(**credentials)
        if user_or_none and user_or_none.is_superuser:
            user_or_none = user_or_none
        elif user_or_none and user_or_none.userprofile.account.site != Site.objects.get_current():
            user_or_none = None
        return user_or_none

    def get_user(self, user_id):
        try:
            user = User.objects.get(pk=user_id)
            if user and user.is_superuser:
                return user
            elif user and user.userprofile.account.site == Site.objects.get_current():
                return user
            else:
                return None
            # return , userprofile__account__site=Site.objects.get_current()
        except User.DoesNotExist:
            return None