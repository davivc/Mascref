from rest_framework import serializers

# Models
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


class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


# Serializers define the API representation.
class ActivitySerializer(serializers.ModelSerializer):
    firstname = serializers.ReadOnlyField(source='user.first_name', read_only=True)

    class Meta:
        model = APIRequestLog
        fields = ('id','requested_at','path','method','data','response','user','firstname',)

        # def get_queryset(self):
        #     queryset = APIRequestLog.objects.filter(method='POST') | APIRequestLog.objects.filter(method='PATCH')
        #     return queryset


class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.ReadOnlyField(source='is_superuser', read_only=True)

    class Meta:
        model = User
        fields = ('id', 'url', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_admin', 'date_joined')

        
class ConfigSerializer (serializers.ModelSerializer):
    class Meta:
        model = Config
        fields = ('name','value')


class SiteSerializer (serializers.ModelSerializer):
    town_name = serializers.ReadOnlyField(source='town.name', read_only=True)
    province_name = serializers.ReadOnlyField(source='town.province.name', read_only=True)
    country_name = serializers.ReadOnlyField(source='town.country.name', read_only=True)
    
    class Meta:
        model = Site
        fields = ('id','name','lat','long','town','town_name','province_name','country_name')


class CountrySerializer (serializers.ModelSerializer):
    # provinces_total = serializers.ReadOnlyField(source='provinces.count')
    # towns_total = serializers.ReadOnlyField(source='towns.count')
    # sites = serializers.ReadOnlyField(source='sites__len')
    # sites = SiteSerializer

    class Meta:
        model = Country
        fields = ('id','name','provinces','towns','sites','surveys','transects')


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
        fields = ('id','name','country','towns','sites','surveys','transects')


class TownSerializer (serializers.ModelSerializer):
    class Meta:
        model = Town
        fields = ('id','name','country','province')


class ResearcherSerializer (serializers.ModelSerializer):
    is_admin = serializers.ReadOnlyField(source='user.is_superuser')
    is_staff = serializers.ReadOnlyField(source='user.is_staff')

    class Meta:
        model = Researcher
        fields = ('id', 'name','is_admin','is_staff')


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


class TransectSerializer (serializers.ModelSerializer):
    site_name = serializers.ReadOnlyField(source='site.name', read_only=True)
    town_name = serializers.ReadOnlyField(source='site.town.name', read_only=True)
    team_leader_name = serializers.ReadOnlyField(source='team_leader.name', read_only=True)    

    class Meta:
        model = Transect
        fields = ('id','survey','site','name','depth','date','time_start','team_leader','team_leader_name','site_name','town_name')


class SurveySerializer (serializers.ModelSerializer):
    sites = SiteSerializer(many=True, read_only=True)
    owner_name = serializers.ReadOnlyField(source='owner.name', read_only=True)

    class Meta:
        model = Survey
        fields = ('id','project','name','date_start','date_end','owner','public','created_at','transects_count','sites','owner_name')


class ProjectSerializer (serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    owner_name = serializers.ReadOnlyField(source='owner.name', read_only=True)
    # groups = GroupSerializer(many=True)

    class Meta:
        model = Project
        fields = ('id','name','description','parent','public','created_at','created_by','owner','updated_at','surveys_count','transects_count','owner_name','groups')


    def create(self, validated_data):
        groups = Group.objects.filter(set=1)
        project = Project.objects.create(**validated_data)
        project.groups.add(*groups)
        return project


    # def update(self, instance, validated_data):
    #     groups = validated_data.pop('groups')
    #     instance.name = validated_data.get('name', instance.name)
    #     instance.parent = validated_data.get('parent', instance.parent)
    #     instance.owner = validated_data.get('name', instance.owner)
    #     instance.name = validated_data.get('name', instance.name)
    #     instance.name = validated_data.get('name', instance.name)
    #     # project.groups.add(*groups)
    #     return project


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

