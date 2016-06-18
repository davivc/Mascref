from rest_framework import serializers
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
            'id', 'survey', 'site', 'name', 'depth', 'date', 'time_start',
            'team_leader', 'team_leader_name', 'site_name', 'town_name'
        )


class TransectInfoSerializer (serializers.ModelSerializer):
    class Meta:
        model = TransectInfo
        fields = ('id', 'transect', 'name', 'value', 'description',)


class SegmentSerializer (serializers.ModelSerializer):
    group_name = serializers.ReadOnlyField(source='group.name', read_only=True)
    parent = serializers.ReadOnlyField(
        source='group.parent.id', read_only=True)
    parent_name = serializers.ReadOnlyField(
        source='group.parent.name', read_only=True)

    class Meta:
        model = Segment
        fields = (
            'token', 'transect', 'type', 'segment', 'group', 'group_name',
            'parent', 'parent_name', 'value', 'created_at', 'updated_at',
        )


# Non-Models Serializers
class StatsSerializer (serializers.Serializer):
    transects = serializers.IntegerField()
