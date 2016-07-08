"""
Definition of views.
"""
from rest_framework import viewsets, permissions, filters
from rest_framework.response import Response
from mascref.permissions import UserPermissionsObj
from mascref.permissions import UserFromAccount
from mascref.permissions import ObjectFromAccount
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
from reefcheck.models import Transect
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
        permissions.IsAuthenticated, permissions.IsAdminUser, 
    )


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = (
        permissions.IsAuthenticated, UserFromAccount, ObjectFromAccount, 
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
        queryset = queryset.filter(account=self.request.account)
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
        permissions.IsAuthenticated, UserFromAccount, 
    )

    def get_queryset(self):
        queryset = Survey.objects.all()
        queryset = queryset.filter(project__account=self.request.account)
        return queryset

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

    def get_queryset(self):
        queryset = Researcher.objects.all()
        queryset = queryset.filter(account=self.request.account)
        return queryset


# Non-Models
class StatsViewSet(viewsets.ViewSet):
    def list(self, request):
        stats = Stats
        stats.projects = Project.objects.filter(account=request.account).count()
        stats.surveys = Survey.objects.filter(project__account=request.account).count()
        stats.transects = Transect.objects.filter(survey__project__account=request.account).count()
        stats.sites = Transect.objects.filter(survey__project__account=request.account).values("site").distinct().count()
        stats.countries = Transect.objects.filter(survey__project__account=request.account).values("site__town__country").distinct().count()
        stats.provinces = Transect.objects.filter(survey__project__account=request.account).values("site__town__province").distinct().count()
        stats.towns = Transect.objects.filter(survey__project__account=request.account).values("site__town").distinct().count()
        serializer = StatsSerializer(stats)
        return Response(serializer.data)
