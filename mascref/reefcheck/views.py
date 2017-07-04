"""
Definition of views.
"""
from rest_framework import generics, viewsets, permissions, filters
from rest_framework.response import Response
from rest_framework_bulk.generics import BulkModelViewSet
from mascref.permissions import UserPermissionsObj
from django.db import connections
from django.http import HttpResponse
# from rest_framework_tracking.mixins import LoggingMixin
from rest_pandas import PandasSimpleView
from rest_pandas import PandasUnstackedSerializer
import pandas as pd
from pandas.io.json import json_normalize

from models import TransectType
from models import GroupCategory
from models import GroupSet
from models import Group
from models import Transect
from models import TransectInfo
from models import Segment
from objects import Stats
from serializers import TransectTypeSerializer
from serializers import GroupCategorySerializer
from serializers import GroupSetSerializer
from serializers import GroupSerializer
from serializers import TransectSerializer
from serializers import TransectInfoSerializer
from serializers import SegmentSerializer
from serializers import SubstrateSerializer
from serializers import BeltSerializer
from serializers import StatsSerializer


class TransectTypeViewSet(viewsets.ModelViewSet):
    queryset = TransectType.objects.all()
    serializer_class = TransectTypeSerializer
    ordering = ('name',)
    permission_classes = (
        permissions.IsAdminUser,
        permissions.IsAuthenticated,
    )


class GroupCategoryViewSet(viewsets.ModelViewSet):
    queryset = GroupCategory.objects.all()
    serializer_class = GroupCategorySerializer
    ordering = ('name',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('type',)
    permission_classes = (
        permissions.IsAuthenticated,
    )


class GroupSetViewSet(viewsets.ModelViewSet):
    queryset = GroupSet.objects.all()
    serializer_class = GroupSetSerializer
    ordering = ('name',)
    permission_classes = (
        permissions.IsAdminUser,
        permissions.IsAuthenticated,
    )


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    ordering = ('name',)
    ordering_fields = ('name','description',)
    filter_backends = (filters.DjangoFilterBackend,filters.OrderingFilter,)
    filter_fields = ('category', 'type', 'set', )
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


class TransectViewSet(viewsets.ModelViewSet):
    queryset = Transect.objects.all()
    serializer_class = TransectSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('survey',)
    ordering = ('name', 'date', )
    permission_classes = (
        permissions.IsAuthenticated,
    )

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user.userprofile)

    def get_queryset(self):
        queryset = Transect.objects.all()
        queryset = queryset.filter(survey__project__account=self.request.account)
        return queryset


class TransectInfoViewSet(BulkModelViewSet):
    queryset = TransectInfo.objects.all()
    serializer_class = TransectInfoSerializer
    ordering = ('name',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('transect', 'name',)
    permission_classes = (
        permissions.IsAuthenticated,
    )


class SegmentViewSet(BulkModelViewSet):
    queryset = Segment.objects.all()
    serializer_class = SegmentSerializer
    ordering = ('token',)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('transect', 'segment', 'group', 'token', 'type',)
    permission_classes = (
        permissions.IsAuthenticatedOrReadOnly,
    )

# Data Views

class SubstrateViewSet(PandasSimpleView):
    
    def transform_dataframe(self, dataframe, request):
        # Define the aggregation calculations
        aggregations = {
            'group_code':  {'count':'count'}
        }

        if request.GET.get('show','') == 'project':
            grouping = ['project_id','project_name']
        elif request.GET.get('show','') == 'survey':
            grouping = ['survey_id','survey_name']
        elif request.GET.get('show','') == 'country':
            grouping = ['country_id','country']
        elif request.GET.get('show','') == 'year':
            grouping = ['year']
        elif request.GET.get('show','') == 'site':
            grouping = ['site_id','site_name']
        elif request.GET.get('show','') == 'group':
            grouping = ['group_code','group_name']
        else:
            grouping = [
                'project_id',
                'project_name',
                'survey_id',
                'survey_name',
                'country_id',
                'country',
                'town',
                'site_id',
                'site_name',
                'depth',
                'transect_identifier',
                'transect_id',
                'year',
                'date',
                'group_name',
                'group_code'
            ]
        df = dataframe.groupby(grouping).agg(aggregations)
        df.columns = df.columns.droplevel(0)
        df = pd.DataFrame(df.to_records())
        return df

    def dictfetchall(self, cursor):
        "Returns all rows from a cursor as a dict."
        desc = cursor.description
        return [
            dict(zip([col[0] for col in desc], row))
            for row in cursor.fetchall()
        ]

    def get(self, request, *args, **kwargs):
        data = self.get_data(request, *args, **kwargs)
        serializer_class = self.with_list_serializer(self.serializer_class)
        serializer = serializer_class(data, many=True)
        if request.GET.get('format','') == 'csv':
            resp = Response(serializer.data, content_type='application/x-download')
            resp['Content-Disposition'] = 'attachment;filename=substrate_data.csv'
            return resp
        else:
            return Response(serializer.data)

    def get_data(self, request, *args, **kwargs):
        rows = []
        with connections['default'].cursor() as cursor:
            query = """SELECT 
                            p.id as project_id, p.name as project_name, su.id as survey_id, su.name as survey_name, c.name as country, c.id as country_id,
                            town.name as town, si.id as site_id, si.name as site_name, t.date as date, YEAR(t.date) as year, t.depth as depth, t.name as transect_identifier,
                            t.id as transect_id, s.segment, s.value as point_intercept_number, g.name as group_code, g.description as group_name
                        FROM reefcheck_segment s 
                        LEFT JOIN reefcheck_group g ON s.group_id = g.id 
                        LEFT JOIN reefcheck_transect t ON t.id = s.transect_id 
                        LEFT JOIN app_site si ON si.id = t.site_id 
                        LEFT JOIN app_town town ON town.id = si.town_id 
                        LEFT JOIN app_country c ON c.id = town.country_id 
                        LEFT JOIN app_survey su ON su.id = t.survey_id 
                        LEFT JOIN app_project p ON p.id = su.project_id
                        WHERE su.account_id = %(s) AND g.type_id = 2
                    """ % self.request.account.id
            filters = []
            if request.GET.get('project',''):
                filters.append("p.id = '%s'" % request.GET.get('project',''))
            if request.GET.get('survey',''):
                filters.append("su.id = '%s'" % request.GET.get('survey',''))
            if request.GET.get('year',''):
                filters.append("YEAR(t.date) = '%s'" % request.GET.get('year',''))
            if request.GET.get('country',''):
                filters.append("c.id = '%s'" % request.GET.get('country',''))
            if request.GET.get('site',''):
                filters.append("si.id = '%s'" % request.GET.get('site',''))

            # print(len(filters))
            # print(filters)
            if len(filters) > 0:
                query = query + " AND " + ' AND '.join(filters)
            # print(query)
            query = query + ";"

            cursor.execute(query)
            rows = self.dictfetchall(cursor)

        dataframe = pd.DataFrame.from_dict(rows)
        if request.GET.get('show','') != '' and len(dataframe) > 0:
            dataframe = self.transform_dataframe(dataframe, request)
            
        return dataframe


class BeltViewSet(PandasSimpleView):    
    def transform_dataframe(self, dataframe, request):
        # Define the aggregation calculations
        aggregations = {
            'group_code':  {'count':'count'}
        }

        if request.GET.get('show','') == 'project':
            grouping = ['project_id','project_name']
        elif request.GET.get('show','') == 'survey':
            grouping = ['survey_id','survey_name']
        elif request.GET.get('show','') == 'country':
            grouping = ['country_id','country']
        elif request.GET.get('show','') == 'year':
            grouping = ['year']
        elif request.GET.get('show','') == 'site':
            grouping = ['site_id','site_name']
        elif request.GET.get('show','') == 'group':
            grouping = ['group_code','group_name']
        else:
            grouping = [
                'project_id',
                'project_name',
                'survey_id',
                'survey_name',
                'country_id',
                'country',
                'town',
                'site_id',
                'site_name',
                'depth',
                'transect_identifier',
                'transect_id',
                'year',
                'date',
                'group_name',
                'group_code'
            ]
        df = dataframe.groupby(grouping).agg(aggregations)
        df.columns = df.columns.droplevel(0)
        df = pd.DataFrame(df.to_records())

        return df

    def dictfetchall(self, cursor):
        "Returns all rows from a cursor as a dict."
        desc = cursor.description
        return [
            dict(zip([col[0] for col in desc], row))
            for row in cursor.fetchall()
        ]

    def get(self, request, *args, **kwargs):
        data = self.get_data(request, *args, **kwargs)
        serializer_class = self.with_list_serializer(self.serializer_class)
        serializer = serializer_class(data, many=True)
        if request.GET.get('format','') == 'csv':
            resp = Response(serializer.data, content_type='application/x-download')
            resp['Content-Disposition'] = 'attachment;filename=substrate_data.csv'
            return resp
        else:
            return Response(serializer.data)


    def get_data(self, request, *args, **kwargs):
        rows = []
        with connections['default'].cursor() as cursor:
            query = """SELECT 
                            p.id as project_id, p.name as project_name, su.id as survey_id, su.name as survey_name, c.name as country, c.id as country_id,
                            town.name as town, si.id as site_id, si.name as site_name, t.date as date, YEAR(t.date) as year, t.depth as depth, t.name as transect_identifier,
                            t.id as transect_id, s.segment, s.value as point_intercept_number, g.name as group_code, g.description as group_name
                        FROM reefcheck_segment s 
                        LEFT JOIN reefcheck_group g ON s.group_id = g.id 
                        LEFT JOIN reefcheck_transect t ON t.id = s.transect_id 
                        LEFT JOIN app_site si ON si.id = t.site_id 
                        LEFT JOIN app_town town ON town.id = si.town_id 
                        LEFT JOIN app_country c ON c.id = town.country_id 
                        LEFT JOIN app_survey su ON su.id = t.survey_id 
                        LEFT JOIN app_project p ON p.id = su.project_id
                        WHERE g.type_id = 1
                    """
            filters = []
            if request.GET.get('project',''):
                filters.append("p.id = '%s'" % request.GET.get('project',''))
            if request.GET.get('survey',''):
                filters.append("su.id = '%s'" % request.GET.get('survey',''))
            if request.GET.get('year',''):
                filters.append("YEAR(t.date) = '%s'" % request.GET.get('year',''))
            if request.GET.get('country',''):
                filters.append("c.id = '%s'" % request.GET.get('country',''))
            if request.GET.get('site',''):
                filters.append("si.id = '%s'" % request.GET.get('site',''))

            if len(filters) > 0:
                query = query + " AND " + ' AND '.join(filters)

            query = query + ";"

            cursor.execute(query)
            rows = self.dictfetchall(cursor)

        dataframe = pd.DataFrame.from_dict(rows)
        if request.GET.get('show','') != '' and len(dataframe) > 0:
            dataframe = self.transform_dataframe(dataframe, request)
            
        return dataframe


# Non-Models
class StatsViewSet(viewsets.ViewSet):
    def list(self, request):
        stats = Stats
        stats.transects = Transect.objects.count()
        serializer = StatsSerializer(stats)
        return Response(serializer.data)
