from rest_framework import serializers

# Models
from django.contrib.auth.models import User
from app.serializers import UserProfileSerializer
# from rest_framework_tracking.models import APIRequestLog
from app.models import Config


class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


# Serializers define the API representation.
# class ActivitySerializer(serializers.ModelSerializer):
#     firstname = serializers.ReadOnlyField(
#         source='user.first_name', read_only=True
#     )

#     class Meta:
#         model = APIRequestLog
#         fields = (
#             'id', 'requested_at', 'path', 'method',
#             'data', 'response', 'user', 'firstname',
#         )


class UserSerializer(serializers.ModelSerializer):
    userprofile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'url', 'username', 'email', 'first_name',
            'last_name', 'is_staff', 'userprofile', 'date_joined',
        )


class ConfigSerializer (serializers.ModelSerializer):
    class Meta:
        model = Config
        fields = ('name', 'value')
