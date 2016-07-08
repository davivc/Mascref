# from django.conf import settings
# from django.contrib.sites.models import get_context_data

from django.conf import settings
from django.core.urlresolvers import resolve, Resolver404
from django.shortcuts import redirect

from mascref import urls as frontend_urls
from app.models import Account

class SiteMiddleware(object):
    def process_request(self, request):
        print(request.get_current_site())
        try:
            current_site = Site.objects.get(domain=request.get_host())
        except Site.DoesNotExist:
            current_site = Site.objects.get(id=settings.DEFAULT_SITE_ID)

        request.current_site = current_site
        settings.SITE_ID = current_site.id


class AccountIDMiddleware(object):

    def process_request(self, request):
        path = request.get_full_path()
        domain = request.META['HTTP_HOST']
        pieces = domain.split('.')
        redirect_path = "http://{0}{1}".format(
                settings.DEFAULT_SITE_DOMAIN, path)
        if domain == settings.DEFAULT_SITE_DOMAIN:
            return None
        try:
            resolve(path, frontend_urls)
        except Resolver404:
            try:
                # The slashes are not being appended before getting here
                resolve(u"{0}/".format(path), frontend_urls)
            except Resolver404:
                return redirect(redirect_path)
        try:
            account = Account.objects.get(domain=pieces[0])
        except Account.DoesNotExist:
            return redirect(redirect_path)
        request.account = account
        # print(request.account)
        return None
