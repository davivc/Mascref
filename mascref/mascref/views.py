# Rest imports
from rest_framework import generics, viewsets, permissions, filters
from rest_framework.response import Response
# from rest_framework_tracking.mixins import LoggingMixin

from mascref.permissions import UserPermissionsObj
from mascref.permissions import UserFromAccount

# Models
from django.db.models import Q
from django.contrib.auth.models import User

# from rest_framework_tracking.models import APIRequestLog
from activity_log.models import ActivityLog

from app.models import Config

# Serializers
from mascref.serializers import ConfigSerializer
from mascref.serializers import UserSerializer
from mascref.serializers import ActivitySerializer


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

    def get_queryset(self):
        queryset = User.objects.all()
        queryset = queryset.filter(userprofile__account=self.request.account)
        return queryset


# API models
class ConfigViewSet(viewsets.ModelViewSet):
    queryset = Config.objects.all()
    serializer_class = ConfigSerializer
    permission_classes = (
        permissions.IsAuthenticated,
    )


class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.filter(Q(request_method='POST') | Q(request_method='PATCH')).exclude(Q(response_code=400)).order_by('-datetime')[:25]
    serializer_class = ActivitySerializer
    ordering = ('datetime',)
    permission_classes = (
        permissions.IsAuthenticated,
    )
