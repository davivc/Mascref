# Rest imports
from rest_framework import generics, viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework_tracking.mixins import LoggingMixin

from mascref.permissions import UserPermissionsObj

# import django_filters
# from rest_framework.decorators import api_view
# from django.views.decorators.csrf import csrf_exempt
# from rest_framework.renderers import JSONRenderer
# from rest_framework.parsers import JSONParser
# from django.http import HttpResponse

# Models
from django.db.models import Q
from django.contrib.auth.models import User

from rest_framework_tracking.models import APIRequestLog

from app.models import Config
from app.models import Country
from app.models import Group
from app.models import Group_Category
from app.models import Project
from app.models import Province
from app.models import Researcher
from app.models import Segment
from app.models import Site
from app.models import Survey
from app.models import Town
from app.models import Transect
from app.models import Transect_Type
from app.models import Transect_Info

# Serializers
from mascref.serializers import UserSerializer
from mascref.serializers import ConfigSerializer
from mascref.serializers import CountrySerializer
from mascref.serializers import GroupSerializer
from mascref.serializers import GroupCategorySerializer
from mascref.serializers import ProvinceSerializer
from mascref.serializers import TownSerializer
from mascref.serializers import SegmentSerializer
from mascref.serializers import SiteSerializer
from mascref.serializers import ResearcherSerializer
from mascref.serializers import ProjectSerializer
from mascref.serializers import SurveySerializer
from mascref.serializers import TransectSerializer
from mascref.serializers import TransectTypeSerializer
from mascref.serializers import TransectInfoSerializer
from mascref.serializers import DashboardStatsSerializer
from mascref.serializers import ActivitySerializer


# Objects for non-Models api
class DashboardStats(object):
    def __init__(self):
        self.countries = Country.objects.count()
        self.projects = Project.objects.count()
        self.surveys = Survey.objects.count()
        self.sites = Site.objects.count()
        self.towns = Town.objects.count()
        self.transects = Transect.objects.count()


# Rest-Auth
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (
        permissions.IsAdminUser,
    )


class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer    
    permission_classes = (
        UserPermissionsObj,
    )


# API models
class ConfigViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Config.objects.all()
    serializer_class = ConfigSerializer
    permission_classes = (
        permissions.IsAuthenticated,
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


class GroupViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    ordering = ('name',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('category','type',)
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


class GroupCategoryViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Group_Category.objects.all()
    serializer_class = GroupCategorySerializer
    ordering = ('name',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('type',)
    permission_classes = (
        permissions.IsAuthenticated,
    )


class ProvinceViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer
    ordering = ('name',)
    filter_backends = (filters.SearchFilter,filters.DjangoFilterBackend,)
    filter_fields = ('country',)
    search_fields = ('name',)
    permission_classes = (
        permissions.IsAuthenticated,
    )


class TownViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Town.objects.all()
    serializer_class = TownSerializer
    ordering = ('name',)
    filter_backends = (filters.SearchFilter,filters.DjangoFilterBackend,)
    filter_fields = ('country','province',)
    search_fields = ('name',)
    permission_classes = (
        permissions.IsAuthenticated,
    )


class SegmentViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Segment.objects.all()
    serializer_class = SegmentSerializer
    ordering = ('token',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('transect','segment','group','token','type',)
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


class ResearcherViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Researcher.objects.all()
    serializer_class = ResearcherSerializer
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
    #filter_backends = (filters.DjangoFilterBackend,)
    #filter_fields = ('parent',)
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

    #@list_route(url_path='sub-projects')
    #def set_password(self, request, pk=None):
    #  queryset = Project.objects.filter()


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


class TransectViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Transect.objects.all()
    serializer_class = TransectSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('survey',)
    ordering = ('name','date',)
    permission_classes = (
        permissions.IsAuthenticated,
    )


class TransectTypeViewSet(viewsets.ModelViewSet):
    queryset = Transect_Type.objects.all()
    serializer_class = TransectTypeSerializer
    ordering = ('name',)
    permission_classes = (
        permissions.IsAuthenticated,
    )


class TransectInfoViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Transect_Info.objects.all()
    serializer_class = TransectInfoSerializer
    ordering = ('name',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('transect','name',)
    permission_classes = (
        permissions.IsAuthenticated,
    )

# Non-Models
class DashboardStatsViewSet(viewsets.ViewSet):
    def list(self, request):
        serializer = DashboardStatsSerializer(DashboardStats())
        return Response(serializer.data)


class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = APIRequestLog.objects.filter(Q(method='POST') | Q(method='PATCH')).exclude(Q(path__contains='segments') | Q(status_code=400)).order_by('-requested_at')[:10]
    serializer_class = ActivitySerializer
    ordering = ('requested_at',)
    permission_classes = (
        permissions.IsAuthenticated,
    )
    #def list(self, request):
    #    return Response(serializer.data)


#class JSONResponse(HttpResponse):
#    """
#    An HttpResponse that renders its content into JSON.
#    """
#    def __init__(self, data, **kwargs):
#        content = JSONRenderer().render(data)
#        kwargs['content_type'] = 'application/json'
#        super(JSONResponse, self).__init__(content, **kwargs)


#class DashboardStatsViewSet(viewsets.GenericViewSet):
#    #queryset = Country.objects.count()
#    #serializer_class = DashboardStatsSerializer
#    @csrf_exempt
#    def get(request):
#        """
#        List all code snippets, or create a new snippet.
#        """
#        if request.method == 'GET':
#            countries = Country.objects.count()
#            serializer = DashboardStatsSerializer(countries, many=True)
#            return JSONResponse(serializer.data)


#@api_view(['GET'])
#@csrf_exempt
#def dashboard_totals(request):
#    #countries = Country.objects.count()
#    dash = { 
#      'countries': Country.objects.count() 
#    }
#    serializer = DashboardStatsSerializer(dash)
#    return Response(serializer.data)


