"""
Definition of views.
"""
from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from mascref.permissions import UserPermissionsObj
from mascref.permissions import UserFromAccount
from rest_framework_tracking.mixins import LoggingMixin

from models import Account
from models import UserProfile
from models import Country
from models import Province
from models import Town
from models import Site
from models import Project
from models import Survey
from models import Researcher
from objects import Stats

# from mascref.serializers import UserSerializer
from serializers import AccountSerializer
from serializers import UserProfileSerializer
from serializers import CountrySerializer
from serializers import ProvinceSerializer
from serializers import TownSerializer
from serializers import SiteSerializer
from serializers import ProjectSerializer
from serializers import SurveySerializer
from serializers import ResearcherSerializer
from serializers import StatsSerializer


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = (
        permissions.IsAuthenticated, 
    )


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = (
        UserFromAccount,
    )


class CountryViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    ordering = ('name',)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)
    permission_classes = (
        permissions.IsAuthenticated,
    )


class ProvinceViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer
    ordering = ('name',)
    filter_backends = (filters.SearchFilter, filters.DjangoFilterBackend,)
    filter_fields = ('country',)
    search_fields = ('name',)
    permission_classes = (
        permissions.IsAuthenticated,
    )


class TownViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Town.objects.all()
    serializer_class = TownSerializer
    ordering = ('name',)
    filter_backends = (filters.SearchFilter, filters.DjangoFilterBackend,)
    filter_fields = ('country', 'province',)
    search_fields = ('name',)
    permission_classes = (
        permissions.IsAuthenticated,
    )


class SiteViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    ordering = ('name',)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)
    permission_classes = (
        permissions.IsAuthenticated,
    )


class ProjectViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    ordering = ('name',)
    permission_classes = (
        permissions.IsAuthenticated,
    )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_queryset(self):
        queryset = Project.objects.all()
        parent = self.request.query_params.get('parent', None)
        if parent == 'null':
            queryset = queryset.filter(parent__isnull=True)
        elif parent is not None and parent.isdigit():
            queryset = queryset.filter(parent=parent)

        return queryset


class SurveyViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('project',)
    permission_classes = (
        permissions.IsAuthenticated,
    )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class ResearcherViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Researcher.objects.all()
    serializer_class = ResearcherSerializer
    ordering = ('name',)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)
    permission_classes = (
        permissions.IsAuthenticated,
    )


# Non-Models
class StatsViewSet(viewsets.ViewSet):
    def list(self, request):
        stats = Stats
        stats.projects = Project.objects.count()
        stats.surveys = Survey.objects.count()
        stats.countries = Country.objects.count()
        stats.provinces = Province.objects.count()
        stats.towns = Town.objects.count()
        stats.sites = Site.objects.count()
        serializer = StatsSerializer(stats)
        return Response(serializer.data)
