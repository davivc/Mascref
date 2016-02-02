"""
Definition of urls for Mascref.
"""

from datetime import datetime
from django.conf.urls import patterns, url
from app.forms import BootstrapAuthenticationForm

# Uncomment the next lines to enable the admin:
from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth.models import User
from rest_framework import routers
from Mascref.serializers import ConfigViewSet
from Mascref.serializers import CountryViewSet
from Mascref.serializers import GroupViewSet
from Mascref.serializers import GroupCategoryViewSet
from Mascref.serializers import ProjectViewSet
from Mascref.serializers import ProvinceViewSet
from Mascref.serializers import ResearcherViewSet
from Mascref.serializers import SegmentViewSet
from Mascref.serializers import SiteViewSet
from Mascref.serializers import SurveyViewSet
from Mascref.serializers import TownViewSet
from Mascref.serializers import TransectViewSet
from Mascref.serializers import TransectTypeViewSet
from Mascref.serializers import TransectInfoViewSet
from Mascref.serializers import UserViewSet
from Mascref.serializers import DashboardStatsViewSet
from Mascref.serializers import ActivityViewSet

admin.autodiscover()

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'api/config', ConfigViewSet)
router.register(r'api/countries', CountryViewSet)
router.register(r'api/groups', GroupViewSet)
router.register(r'api/groups_categories', GroupCategoryViewSet)
router.register(r'api/projects', ProjectViewSet)
router.register(r'api/provinces', ProvinceViewSet)
router.register(r'api/researchers', ResearcherViewSet)
router.register(r'api/segments', SegmentViewSet)
router.register(r'api/sites', SiteViewSet)
router.register(r'api/surveys', SurveyViewSet)
router.register(r'api/towns', TownViewSet)
router.register(r'api/transects', TransectViewSet)
router.register(r'api/transects_types', TransectTypeViewSet)
router.register(r'api/transects_infos', TransectInfoViewSet)
router.register(r'api/users', UserViewSet)
router.register(r'api/activity', ActivityViewSet)
router.register(r'api/dashboard/stats', DashboardStatsViewSet, 'dashboard-list')

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'app.views.home', name='home'),
    url(r'^', include(router.urls)),
    #url(r'api/dashboard/stats', 'Mascref.serializers.dashboard_totals', name='dashboard_totals'),
    #url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api-docs/', include('rest_framework_swagger.urls')),
    url(r'^rest-auth/', include('rest_auth.urls')),
#    url(r'^login/$',
#        'django.contrib.auth.views.login',
#        {
#            'template_name': 'app/login.html',
#            'authentication_form': BootstrapAuthenticationForm,
#            'extra_context':
#            {
#                'title':'Log in',
#                'year':datetime.now().year,
#            }
#        },
#        name='login'),
#    url(r'^logout$',
#        'django.contrib.auth.views.logout',
#        {
#            'next_page': '/',
#        },
#        name='logout'),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)
