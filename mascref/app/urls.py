# from django.conf.urls import patterns
from django.conf.urls import url, include

from rest_framework import routers

from views import GroupACLViewSet
# from views import AccountViewSet
from views import UserProfileViewSet
from views import CountryViewSet
from views import ProvinceViewSet
from views import TownViewSet
from views import SiteViewSet
from views import SiteSurveyViewSet
from views import ProjectViewSet
from views import SurveyViewSet
from views import ResearcherViewSet
from views import StatsViewSet


router = routers.DefaultRouter()
router.register(r'groups_acl', GroupACLViewSet)
# router.register(r'accounts', AccountViewSet)
router.register(r'user_profile', UserProfileViewSet)
router.register(r'countries', CountryViewSet)
router.register(r'provinces', ProvinceViewSet)
router.register(r'towns', TownViewSet)
router.register(r'sites', SiteViewSet)
router.register(r'site_surveys', SiteSurveyViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'surveys', SurveyViewSet)
router.register(r'researchers', ResearcherViewSet)
router.register(r'stats/app', StatsViewSet, 'stats-app')

urlpatterns = [
    # '',
    url(r'^', include(router.urls)),
]
