import django_filters
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, serializers, viewsets, permissions, filters
from rest_framework_tracking.mixins import LoggingMixin
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
from django.contrib.auth.models import User


# Objects for non-Models api
class DashboardStats(object):
    def __init__(self):
        self.countries = Country.objects.count()
        self.projects = Project.objects.count()
        self.surveys = Survey.objects.count()
        self.sites = Site.objects.count()
        self.towns = Town.objects.count()
        self.transects = Transect.objects.count()


class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data

# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff','date_joined')

        
class ConfigSerializer (serializers.ModelSerializer):
    class Meta:
        model = Config
        fields = ('name','value')


class CountrySerializer (serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('id','name',)


class GroupSerializer (serializers.ModelSerializer):
    #tracks = GroupSerializer(many=True, read_only=True)
    sub_groups = RecursiveField(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ('id','name','description','parent','category','type','format','sub_groups',)


class GroupCategorySerializer (serializers.ModelSerializer):
    class Meta:
        model = Group_Category
        fields = ('id','name','description','type',)


class ProvinceSerializer (serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ('id','name','country')


class TownSerializer (serializers.ModelSerializer):
    class Meta:
        model = Town
        fields = ('id','name','country','province')


class ResearcherSerializer (serializers.ModelSerializer):
    class Meta:
        model = Researcher
        fields = ('id', 'name',)


#class SegmentListSerializer(serializers.ListSerializer):
    # Maps for id->instance and id->data item.


class SegmentSerializer (serializers.ModelSerializer):
    group_name = serializers.ReadOnlyField(source='group.name', read_only=True)
    parent = serializers.ReadOnlyField(source='group.parent.id', read_only=True)
    parent_name = serializers.ReadOnlyField(source='group.parent.name', read_only=True)

    class Meta:
        model = Segment
        #list_serializer_class = SegmentListSerializer
        fields = ('token', 'transect','type','segment','group','group_name','parent','parent_name','value','created_at','updated_at',)


class SiteSerializer (serializers.ModelSerializer):
    town_name = serializers.ReadOnlyField(source='town.name', read_only=True)
    province_name = serializers.ReadOnlyField(source='town.province.name', read_only=True)
    country_name = serializers.ReadOnlyField(source='town.country.name', read_only=True)
    
    class Meta:
        model = Site
        fields = ('id','name','lat','long','town','town_name','province_name','country_name')


class TransectSerializer (serializers.ModelSerializer):
    site_name = serializers.ReadOnlyField(source='site.name', read_only=True)
    town_name = serializers.ReadOnlyField(source='site.town.name', read_only=True)
    team_leader_name = serializers.ReadOnlyField(source='team_leader.name', read_only=True)    

    class Meta:
        model = Transect
        fields = ('id','survey','site','name','depth','date','time_start','team_leader','team_leader_name','site_name','town_name')


class SurveySerializer (serializers.ModelSerializer):
    owner_name = serializers.ReadOnlyField(source='owner.name', read_only=True)

    class Meta:
        model = Survey
        fields = ('id','project','name','date_start','date_end','owner','public','created_at','transects_count','owner_name')


class ProjectSerializer (serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    owner_name = serializers.ReadOnlyField(source='owner.name', read_only=True)

    class Meta:
        model = Project
        fields = ('id','name','description','parent','public','created_at','created_by','owner','updated_at','surveys_count','transects_count','owner_name')


class TransectTypeSerializer (serializers.ModelSerializer):
    class Meta:
        model = Transect_Type
        fields = ('name',)


class TransectInfoSerializer (serializers.ModelSerializer):
    class Meta:
        model = Transect_Info
        fields = ('id','transect','name','value','description',)


# Non-Models Serializers
class DashboardStatsSerializer (serializers.Serializer):
    countries = serializers.IntegerField()
    projects = serializers.IntegerField()
    surveys = serializers.IntegerField()
    towns = serializers.IntegerField()
    transects = serializers.IntegerField()
    sites = serializers.IntegerField()


# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class ConfigViewSet(viewsets.ModelViewSet):
    queryset = Config.objects.all()
    serializer_class = ConfigSerializer


class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    ordering = ('name',)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)
    #permission_classes = [
    #    permissions.AllowAny
    #]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    ordering = ('name',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('category','type',)

    def get_queryset(self):
        queryset = Group.objects.all()
        parent = self.request.query_params.get('parent', None)
        if parent == 'null':
            queryset = queryset.filter(parent__isnull=True)
        elif parent is not None and parent.isdigit():
            queryset = queryset.filter(parent=parent)
      
        return queryset


class GroupCategoryViewSet(viewsets.ModelViewSet):
    queryset = Group_Category.objects.all()
    serializer_class = GroupCategorySerializer
    ordering = ('name',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('type',)


class ProvinceViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer
    ordering = ('name',)
    filter_backends = (filters.SearchFilter,filters.DjangoFilterBackend,)
    filter_fields = ('country',)
    search_fields = ('name',)


class TownViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Town.objects.all()
    serializer_class = TownSerializer
    ordering = ('name',)
    filter_backends = (filters.SearchFilter,filters.DjangoFilterBackend,)
    filter_fields = ('country','province',)
    search_fields = ('name',)


class SegmentViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Segment.objects.all()
    serializer_class = SegmentSerializer
    ordering = ('token',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('transect','segment','group','token','type',)


class SiteViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    ordering = ('name',)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


class ResearcherViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Researcher.objects.all()
    serializer_class = ResearcherSerializer
    ordering = ('name',)
    filter_backends = (filters.SearchFilter,)
    search_fields = ('name',)


class ProjectViewSet(LoggingMixin, viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    ordering = ('name',)
    #filter_backends = (filters.DjangoFilterBackend,)
    #filter_fields = ('parent',)

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

    def perform_create(self, serializer):
      serializer.save(created_by=self.request.user)


class TransectViewSet(viewsets.ModelViewSet):
    queryset = Transect.objects.all()
    serializer_class = TransectSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('survey',)
    ordering = ('name','date',)


class TransectTypeViewSet(viewsets.ModelViewSet):
    queryset = Transect_Type.objects.all()
    serializer_class = TransectTypeSerializer
    ordering = ('name',)


class TransectInfoViewSet(viewsets.ModelViewSet):
    queryset = Transect_Info.objects.all()
    serializer_class = TransectInfoSerializer
    ordering = ('name',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('transect','name',)


# Non-Models
class DashboardStatsViewSet(LoggingMixin, viewsets.ViewSet):
    def list(self, request):
        serializer = DashboardStatsSerializer(DashboardStats())
        return Response(serializer.data)


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


