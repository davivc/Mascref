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
from Mascref.views import ConfigViewSet
from Mascref.views import CountryViewSet
from Mascref.views import GroupViewSet
from Mascref.views import GroupCategoryViewSet
from Mascref.views import ProjectViewSet
from Mascref.views import ProvinceViewSet
from Mascref.views import ResearcherViewSet
from Mascref.views import SegmentViewSet
from Mascref.views import SiteViewSet
from Mascref.views import SurveyViewSet
from Mascref.views import TownViewSet
from Mascref.views import TransectViewSet
from Mascref.views import TransectTypeViewSet
from Mascref.views import TransectInfoViewSet
from Mascref.views import UserList
from Mascref.views import UserDetail
from Mascref.views import DashboardStatsViewSet
from Mascref.views import ActivityViewSet

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
# router.register(r'api/users', UserViewSet)
# router.register(r'api/users/$', UserList,as_view(), base_name='user')
# router.register(r'api/users/(?P<pk>[0-9]+)/$', UserDetail.as_view(),'user')
router.register(r'api/activity', ActivityViewSet)
router.register(r'api/dashboard/stats', DashboardStatsViewSet, 'dashboard-stats')

urlpatterns = patterns('',
    # Pages
    url(r'^$', 'app.views.home', name='home'),

    # Custom Views
    url(r'^api/users/$', UserList.as_view(), name='user-list'),
    url(r'^api/users/(?P<pk>[0-9]+)/$', UserDetail.as_view(), name='user-detail'),

    # Router
    url(r'^', include(router.urls)),
    #url(r'api/dashboard/stats', 'Mascref.views.dashboard_totals', name='dashboard_totals'),
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





