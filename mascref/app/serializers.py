from rest_framework import serializers

from models import Account
from models import UserProfile
from models import Country
from models import Province
from models import Town
from models import Site
from models import Project
from models import Survey
from models import Researcher


class AccountSerializer(serializers.ModelSerializer):
    # site = AccountSerializer(read_only=True)
    class Meta:
        model = Account
        fields = (
            'name', 'site'
        )


class UserProfileSerializer(serializers.ModelSerializer):
    account = AccountSerializer(read_only=True)
    class Meta:
        model = UserProfile
        fields = (
            'account',
        )


class CountrySerializer (serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = (
            'id', 'name', 'provinces', 'towns', 'sites', 'surveys',
            'transects'
        )


class ProvinceSerializer (serializers.ModelSerializer):
    country_name = serializers.ReadOnlyField(
        source='country.name', read_only=True
    )

    class Meta:
        model = Province
        fields = (
            'id', 'name', 'country', 'towns', 'sites',
            'surveys', 'transects', 'country_name'
        )


class TownSerializer (serializers.ModelSerializer):
    province_name = serializers.ReadOnlyField(
        source='province.name', read_only=True
    )
    country_name = serializers.ReadOnlyField(
        source='country.name', read_only=True
    )

    class Meta:
        model = Town
        fields = (
            'id', 'name', 'country', 'province', 'sites',
            'surveys', 'transects', 'province_name', 'country_name'
        )


class SiteSerializer (serializers.ModelSerializer):
    town_name = serializers.ReadOnlyField(
        source='town.name', read_only=True
    )
    province_name = serializers.ReadOnlyField(
        source='town.province.name', read_only=True
    )
    country_name = serializers.ReadOnlyField(
        source='town.country.name', read_only=True
    )

    class Meta:
        model = Site
        fields = ('id', 'name', 'lat', 'long', 'town', 'surveys',
                  'transects', 'town_name', 'province_name', 'country_name')


class ProjectSerializer (serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.username')
    owner_name = serializers.ReadOnlyField(source='owner.name', read_only=True)

    class Meta:
        model = Project
        fields = (
            'id', 'name', 'description', 'parent', 'public', 'created_at',
            'created_by', 'owner', 'updated_at', 'owner_name', 'surveys',
        )

    # def create(self, validated_data):
    #     groups = Group.objects.filter(set=1)
    #     project = Project.objects.create(**validated_data)
    #     project.groups.add(*groups)
    #     return project


class SurveySerializer (serializers.ModelSerializer):
    sites = SiteSerializer(many=True, read_only=True)
    created_by = serializers.ReadOnlyField(source='created_by.username')
    transects_count = serializers.ReadOnlyField()
    owner_name = serializers.ReadOnlyField(
        source='owner.name', read_only=True
    )

    class Meta:
        model = Survey
        fields = (
            'id', 'project', 'name', 'date_start', 'date_end', 'owner',
            'public', 'created_at', 'created_by', 'owner_name', 'sites',
            'transects_count'
        )


class ResearcherSerializer (serializers.ModelSerializer):
    is_admin = serializers.ReadOnlyField(source='user.is_superuser')
    is_staff = serializers.ReadOnlyField(source='user.is_staff')

    class Meta:
        model = Researcher
        fields = ('id', 'name', 'is_admin', 'is_staff')


# Non-Models Serializers
class StatsSerializer (serializers.Serializer):
    projects = serializers.IntegerField()
    surveys = serializers.IntegerField()
    countries = serializers.IntegerField()
    provinces = serializers.IntegerField()
    towns = serializers.IntegerField()
    sites = serializers.IntegerField()
    transects = serializers.IntegerField()
