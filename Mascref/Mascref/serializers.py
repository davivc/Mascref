from rest_framework import serializers, viewsets, permissions
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