from unittest import TestCase
from rest_assured.testcases import BaseRESTAPITestCase
from mascref.testcases import MascrefAPITestCase

from serializers import TransectTypeSerializer
from serializers import GroupCategorySerializer
from serializers import GroupSetSerializer
from serializers import GroupSerializer
from serializers import TransectSerializer
from serializers import TransectInfoSerializer
from serializers import SegmentSerializer

from mascref.factories import UserFactory
from mascref.factories import UserAdminFactory
from app.factories import SiteFactory
from app.factories import SurveyFactory
from factories import TransectTypeFactory
from factories import GroupCategoryFactory
from factories import GroupSetFactory
from factories import GroupFactory
from factories import TransectFactory
from factories import TransectInfoFactory
from factories import SegmentFactory
from factories import StatsFactory


class TransectTypeTestCase(MascrefAPITestCase, BaseRESTAPITestCase):

    base_name = 'transecttype'
    factory_class = TransectTypeFactory
    serializer_class = TransectTypeSerializer
    user_factory = UserAdminFactory
    create_data = {'name': 'Belt', }
    update_data = {'name': 'Line'}


class GroupCategoryTestCase(MascrefAPITestCase, BaseRESTAPITestCase):

    base_name = 'groupcategory'
    factory_class = GroupCategoryFactory
    serializer_class = GroupCategorySerializer
    user_factory = UserFactory
    update_data = {'name': 'Line'}

    def setUp(self):
        self.transecttype = TransectTypeFactory.create()
        super(GroupCategoryTestCase, self).setUp()

    def get_create_data(self):
        return {
            'name': 'Fish',
            'type': self.transecttype.pk
        }


class GroupSetTestCase(MascrefAPITestCase, BaseRESTAPITestCase):

    base_name = 'groupset'
    factory_class = GroupSetFactory
    serializer_class = GroupSetSerializer
    user_factory = UserAdminFactory
    create_data = {'name': 'ReefCheck Pacific', }
    update_data = {'name': 'ReefCheck Atlantic'}


class GroupTestCase(MascrefAPITestCase, BaseRESTAPITestCase):

    base_name = 'group'
    factory_class = GroupFactory
    serializer_class = GroupSerializer
    user_factory = UserFactory
    update_data = {'name': 'Line'}

    def setUp(self):
        self.set = GroupSetFactory.create()
        self.transecttype = TransectTypeFactory.create()
        self.category = GroupCategoryFactory.create()
        super(GroupTestCase, self).setUp()

    def get_create_data(self):
        return {
            'set': self.set.pk,
            'type': self.transecttype.pk,
            'category': self.category.pk,
            'name': 'Butterflyfish',
            'description': 'Lorem Ipsum',
        }


class TransectTestCase(MascrefAPITestCase, BaseRESTAPITestCase):

    base_name = 'transect'
    factory_class = TransectFactory
    serializer_class = TransectSerializer
    user_factory = UserFactory
    update_data = {'name': 'Line'}

    def setUp(self):
        self.survey = SurveyFactory.create()
        self.site = SiteFactory.create()
        super(TransectTestCase, self).setUp()

    def get_create_data(self):
        return {
            'survey': self.survey.pk,
            'site': self.site.pk,
            'name': 'Muaivuso Flats 23-11-15 s',
            'depth': 3.4,
            'date': '2015-11-23',
            'time_start': '10:10:00',
            'time_end': '14:35:00',
        }


class TransectInfoTestCase(MascrefAPITestCase, BaseRESTAPITestCase):

    base_name = 'transectinfo'
    factory_class = TransectInfoFactory
    serializer_class = TransectInfoSerializer
    user_factory = UserFactory
    update_data = {'name': 'Line'}

    def setUp(self):
        self.transect = TransectFactory.create()
        super(TransectInfoTestCase, self).setUp()

    def get_create_data(self):
        return {
            'transect': self.transect.pk,
            'name': 'temperature_air',
            'value': 27,
            'description': '',
        }


class SegmentTestCase(MascrefAPITestCase, BaseRESTAPITestCase):

    base_name = 'segment'
    factory_class = SegmentFactory
    serializer_class = SegmentSerializer
    user_factory = UserFactory
    update_data = {'value': 7}
    lookup_field = 'token'
    response_lookup_field = 'token'
    attributes_to_check = ['token']

    def setUp(self):
        self.transecttype = TransectTypeFactory.create()
        self.transect = TransectFactory.create()
        self.group = GroupFactory.create()
        super(SegmentTestCase, self).setUp()

    def get_create_data(self):
        return {
            'token': '1_15_1_3',
            'type': self.transecttype.pk,
            'transect': self.transect.pk,
            'group': self.group.pk,
            'segment': 1,
            'value': 4,
        }


class StatsTestCase(TestCase):
    object = StatsFactory.build()

    def test_stats(self):
        self.assertTrue(isinstance(self.object.transects, int))
