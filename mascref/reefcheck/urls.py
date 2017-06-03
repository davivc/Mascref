# from django.conf.urls import patterns
from django.conf.urls import url, include

from rest_framework import routers
from rest_framework_bulk.routes import BulkRouter

from views import TransectTypeViewSet
from views import GroupCategoryViewSet
from views import GroupSetViewSet
from views import GroupViewSet
from views import TransectViewSet
from views import TransectInfoViewSet
from views import SegmentViewSet
from views import SubstrateViewSet
from views import StatsViewSet


router = routers.DefaultRouter()
router.register(r'transects_types', TransectTypeViewSet)
router.register(r'groups_categories', GroupCategoryViewSet)
router.register(r'groups_sets', GroupSetViewSet)
router.register(r'groups', GroupViewSet)
router.register(r'transects', TransectViewSet)
# router.register(r'transects_infos', TransectInfoViewSet)
# router.register(r'segments', SegmentViewSet)
router.register(r'stats/reefcheck', StatsViewSet, 'stats-reefcheck')

bulk = BulkRouter()
bulk.register(r'transects_infos', TransectInfoViewSet)
bulk.register(r'segments', SegmentViewSet)

urlpatterns = [
    # '',
    url(r'^', include(router.urls)),
    url(r'^', include(bulk.urls)),
    url(r'^data_substrate', SubstrateViewSet.as_view()),
]

