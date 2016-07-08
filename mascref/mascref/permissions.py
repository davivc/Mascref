from rest_framework import permissions

class UserPermissionsObj(permissions.BasePermission):
    """
    Owners of the object or admins can do anything.
    Everyone else can do nothing.
    """

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True

        return obj == request.user


class UserFromAccount(permissions.BasePermission):
    """
    User from account can do anything.
    """
    message = 'Adding customers not allowed.'

    def has_permission(self, request, view):
        print(request.user.userprofile.account)
        print(request.account)
        if request.user.userprofile.account == request.account:
            return True


class ObjectFromAccount(permissions.BasePermission):
    """
    User from account can do anything.
    """
    # message = 'You can not access this .'

    def has_object_permission(self, request, view, obj):
        if obj.account == request.account:
            return True
