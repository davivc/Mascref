"""
Definition of views.
"""
from rest_framework import generics, viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework_bulk.generics import BulkModelViewSet
from mascref.permissions import UserPermissionsObj
# from rest_framework_tracking.mixins import LoggingMixin

from models import TransectType
from models import GroupCategory
from models import GroupSet
from models import Group
from models import Transect
from models import TransectInfo
from models import Segment
from objects import Stats
from serializers import TransectTypeSerializer
from serializers import GroupCategorySerializer
from serializers import GroupSetSerializer
from serializers import GroupSerializer
from serializers import TransectSerializer
from serializers import TransectInfoSerializer
from serializers import SegmentSerializer
from serializers import StatsSerializer


class TransectTypeViewSet(viewsets.ModelViewSet):
    queryset = TransectType.objects.all()
    serializer_class = TransectTypeSerializer
    ordering = ('name',)
    permission_classes = (
        permissions.IsAdminUser,
        permissions.IsAuthenticated,
    )


class GroupCategoryViewSet(viewsets.ModelViewSet):
    queryset = GroupCategory.objects.all()
    serializer_class = GroupCategorySerializer
    ordering = ('name',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('type',)
    permission_classes = (
        permissions.IsAuthenticated,
    )


class GroupSetViewSet(viewsets.ModelViewSet):
    queryset = GroupSet.objects.all()
    serializer_class = GroupSetSerializer
    ordering = ('name',)
    permission_classes = (
        permissions.IsAdminUser,
        permissions.IsAuthenticated,
    )


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    ordering = ('name',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('category', 'type', 'set', )
    permission_classes = (
        permissions.IsAuthenticated,
    )

    def get_queryset(self):
        queryset = Group.objects.all()
        parent = self.request.query_params.get('parent', None)
        if parent == 'null':
            queryset = queryset.filter(parent__isnull=True)
        elif parent is not None and parent.isdigit():
            queryset = queryset.filter(parent=parent)
        return queryset


class TransectViewSet(viewsets.ModelViewSet):
    queryset = Transect.objects.all()
    serializer_class = TransectSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('survey',)
    ordering = ('name', 'date', )
    permission_classes = (
        permissions.IsAuthenticated,
    )

    def get_queryset(self):
        queryset = Transect.objects.all()
        queryset = queryset.filter(survey__project__account=self.request.account)
        return queryset


class TransectInfoViewSet(BulkModelViewSet):
    queryset = TransectInfo.objects.all()
    serializer_class = TransectInfoSerializer
    ordering = ('name',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('transect', 'name',)
    permission_classes = (
        permissions.IsAuthenticated,
    )


class SegmentViewSet(BulkModelViewSet):
    queryset = Segment.objects.all()
    serializer_class = SegmentSerializer
    ordering = ('token',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('transect', 'segment', 'group', 'token', 'type',)
    permission_classes = (
        permissions.IsAuthenticatedOrReadOnly,
    )


# Non-Models
class StatsViewSet(viewsets.ViewSet):
    def list(self, request):
        stats = Stats
        stats.transects = Transect.objects.count()
        serializer = StatsSerializer(stats)
        return Response(serializer.data)
