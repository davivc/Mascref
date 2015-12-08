from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import generics, serializers, viewsets, permissions
from app.models import Config
from app.models import Country
from app.models import Project
from app.models import Province
from app.models import Researcher
from app.models import Site
from app.models import Survey
from app.models import Town
from app.models import Transect
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


# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'is_staff','date_joined')

        
class ConfigSerializer (serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Config
        fields = ('name','value')


class CountrySerializer (serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Country
        fields = ('name',)


class ProvinceSerializer (serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Province
        fields = ('name','country')


class TownSerializer (serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Town
        fields = ('name','country','province')


class ResearcherSerializer (serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Researcher
        fields = ('name',)


class SiteSerializer (serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Site
        fields = ('name','lat','long','town')


class ProjectSerializer (serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Project
        fields = ('name','description','parent')


class SurveySerializer (serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Survey
        fields = ('date_start','date_end','project')


class TransectSerializer (serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Transect
        fields = ('name','depth','date','time_start','team_leader','site','survey')


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
    #permission_classes = [
    #    permissions.AllowAny
    #]


class ProvinceViewSet(viewsets.ModelViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer
    ordering = ('name',)


class TownViewSet(viewsets.ModelViewSet):
    queryset = Town.objects.all()
    serializer_class = TownSerializer


class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer


class ResearcherViewSet(viewsets.ModelViewSet):
    queryset = Researcher.objects.all()
    serializer_class = ResearcherSerializer
    ordering = ('name',)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class SurveyViewSet(viewsets.ModelViewSet):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer


class TransectViewSet(viewsets.ModelViewSet):
    queryset = Transect.objects.all()
    serializer_class = TransectSerializer


# Non-Models
class DashboardStatsViewSet(viewsets.ViewSet):
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


