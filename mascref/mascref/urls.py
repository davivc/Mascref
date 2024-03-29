﻿"""
Definition of urls for mascref.
"""

from datetime import datetime
from django.conf.urls import url, include
# from app.forms import BootstrapAuthenticationForm

# Uncomment the next lines to enable the admin:
from django.contrib import admin
# from django.contrib.auth.models import User
from rest_framework import routers
from mascref.views import ConfigViewSet
from mascref.views import UserList
from mascref.views import UserDetail
from mascref.views import ActivityViewSet

# admin.autodiscover()

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
# router.register(r'config', ConfigViewSet)
router.register(r'activity', ActivityViewSet)

urlpatterns = [
#    # '',
#    # Uncomment the admin/doc line below to enable admin documentation:
   # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

#    # Uncomment the next line to enable the admin:
   url(r'^master/admin/', include(admin.site.urls)),
   
#    # Pages
#    # url(r'^$', 'app.views.home', name='home'),

#    # Modules Views
   url(r'^', include('app.urls')),
   url(r'^', include('reefcheck.urls')),

#    # Custom Views
   url(r'^users/$', UserList.as_view(),
      name='user-list'),
   url(r'^users/(?P<pk>[0-9]+)/$',
      UserDetail.as_view(), name='user-detail'),

#    # Router
   url(r'^', include(router.urls)),
#    # url(r'api/dashboard/stats', 'mascref.views.dashboard_totals', name='dashboard_totals'),
#    # url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
   url(r'^docs/', include('rest_framework_swagger.urls')),
   url(r'^rest-auth/', include('rest_auth.urls')),
#    # url(r'^login/$',
#    #     'django.contrib.auth.views.login',
#    #     {
#    #         'template_name': 'app/login.html',
#    #         'authentication_form': BootstrapAuthenticationForm,
#    #         'extra_context':
#    #         {
#    #             'title': 'Log in',
#    #             'year': datetime.now().year,
#    #         }
#    #     },
#    #     name='login'),
#    # url(r'^logout$',
#    #     'django.contrib.auth.views.logout',
#    #     {
#    #         'next_page': '/',
#    #     },
#    #     name='logout'),

                   ]
