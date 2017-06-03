from rest_framework import serializers
from rest_framework_bulk.serializers import BulkListSerializer
from rest_framework_bulk.serializers import BulkSerializerMixin
from mascref.serializers import RecursiveField

from models import TransectType
from models import GroupCategory
from models import GroupSet
from models import Group
from models import Transect
from models import TransectInfo
from models import Segment


class TransectTypeSerializer (serializers.ModelSerializer):
    class Meta:
        model = TransectType
        fields = ('id', 'name',)


class GroupCategorySerializer (serializers.ModelSerializer):
    class Meta:
        model = GroupCategory
        fields = ('id', 'name', 'description', 'type',)


class GroupSetSerializer (serializers.ModelSerializer):
    class Meta:
        model = GroupSet
        fields = ('id', 'name',)


class GroupSerializer (serializers.ModelSerializer):
    # tracks = GroupSerializer(many=True, read_only=True)
    sub_groups = RecursiveField(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ('id', 'set', 'name', 'description', 'parent',
                  'category', 'type', 'format', 'sub_groups',)


class TransectSerializer (serializers.ModelSerializer):
    site_name = serializers.ReadOnlyField(
        source='site.name', read_only=True
    )
    town_name = serializers.ReadOnlyField(
        source='site.town.name', read_only=True
    )
    team_leader_name = serializers.ReadOnlyField(
        source='team_leader.name', read_only=True
    )

    class Meta:
        model = Transect
        fields = (
            'id', 'survey', 'site', 'name', 'depth', 'date', 'year', 'time_start',
            'team_leader', 'team_leader_name', 'site_name', 'town_name'
        )


# class TransectInfoSerializer (serializers.ModelSerializer):
#     class Meta:
#         model = TransectInfo
#         fields = ('id', 'transect', 'name', 'value', 'description',)


class TransectInfoSerializer (BulkSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = TransectInfo
        fields = ('id', 'transect', 'name', 'value', 'description',)
        # only necessary in DRF3
        list_serializer_class = BulkListSerializer


class SegmentSerializer (BulkSerializerMixin, serializers.ModelSerializer):
    group_name = serializers.ReadOnlyField(source='group.name', read_only=True)
    parent = serializers.ReadOnlyField(
        source='group.parent.id', read_only=True)
    parent_name = serializers.ReadOnlyField(
        source='group.parent.name', read_only=True)

    class Meta:
        model = Segment
        fields = (
            'id', 'token', 'transect', 'type', 'segment', 'group', 'group_name',
            'parent', 'parent_name', 'value', 'created_at', 'updated_at',
            # 'id', 'token', 'transect', 'type', 'segment', 'group', 'value', 
        )
        # only necessary in DRF3
        list_serializer_class = BulkListSerializer


class SubstrateSerializer (serializers.ModelSerializer):
    # survey_id = serializers.ReadOnlyField(
    #     source='transect.survey.id', read_only=True)
    # survey_name = serializers.ReadOnlyField(
    #     source='transect.survey.name', read_only=True)
    # transect_id = serializers.ReadOnlyField(
    #     source='transect.id', read_only=True)
    # transect_identifier = serializers.ReadOnlyField(
    #     source='transect.name', read_only=True)
    # site_id = serializers.ReadOnlyField(
    #     source='transect.site.id', read_only=True)
    # site_name = serializers.ReadOnlyField(
    #     source='transect.site.name', read_only=True)
    # depth = serializers.ReadOnlyField(
    #     source='transect.depth', read_only=True)
    # date = serializers.ReadOnlyField(
    #     source='transect.date', read_only=True)
    # country = serializers.ReadOnlyField(
    #     source='transect.site.town.country.name', read_only=True)
    # point_intercept = serializers.ReadOnlyField(source='value', read_only=True)
    # group = serializers.ReadOnlyField(source='group.name', read_only=True)
    # group_name = serializers.ReadOnlyField(source='group.description', read_only=True)


    class Meta:
        model = Segment
        fields = (
            'project_name', 'project_id', 'survey_id', 'survey_name', 'site_id', 'site_name', 'transect_id', 'transect_identifier',
            'date', 'depth', 'country', 'country_id', 'segment', 'point_intercept', 'group', 'group_name',
            # 'id', 'token', 'transect', 'type', 'segment', 'group', 'value', 
        )
        # only necessary in DRF3
        list_serializer_class = BulkListSerializer


# Non-Models Serializers
class StatsSerializer (serializers.Serializer):
    transects = serializers.IntegerField()
