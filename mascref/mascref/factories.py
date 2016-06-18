import factory
from django.contrib.auth.models import User


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    first_name = 'John'
    last_name = 'Doe'
    email = 'user@mascref.com'
    username = factory.Sequence(lambda n: 'user {0}'.format(n))
    password = factory.PostGenerationMethodCall('set_password', '123')
    is_active = True
    is_staff = False
    is_superuser = False


class UserStaffFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    first_name = 'Staff'
    last_name = 'Staff'
    email = 'staff@mascref.com'
    username = 'staff'
    password = factory.PostGenerationMethodCall('set_password', '123')
    is_active = True
    is_staff = True
    is_superuser = False


class UserAdminFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    first_name = 'Admin'
    last_name = 'Admin'
    email = 'admin@mascref.com'
    username = 'admin'
    password = factory.PostGenerationMethodCall('set_password', '123')
    is_active = True
    is_staff = True
    is_superuser = True
