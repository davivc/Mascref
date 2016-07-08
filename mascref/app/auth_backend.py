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
        print(Site.objects.get_current())
        # request = ThreadLocal.get_current_request()
        # print(request)
        # print(dir(self))
        user_or_none = super(SiteBackend, self).authenticate(**credentials)
        # user_or_none = None
        if user_or_none and user_or_none.userprofile.account.site != Site.objects.get_current():
            user_or_none = None
        return user_or_none

    def get_user(self, user_id):
        try:
            return User.objects.get(
                pk=user_id, userprofile__account__site=Site.objects.get_current())
        except User.DoesNotExist:
            return None