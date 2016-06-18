from unittest import TestCase
from rest_assured.testcases import BaseRESTAPITestCase
from mascref.testcases import MascrefAPITestCase

from serializers import CountrySerializer
from serializers import ProvinceSerializer
from serializers import TownSerializer
from serializers import SiteSerializer
from serializers import ProjectSerializer
from serializers import SurveySerializer
from serializers import ResearcherSerializer

from mascref.factories import UserFactory
from factories import CountryFactory
from factories import ProvinceFactory
from factories import TownFactory
from factories import SiteFactory
from factories import ProjectFactory
from factories import SurveyFactory
from factories import ResearcherFactory
from factories import StatsFactory


class CountryTestCase(MascrefAPITestCase, BaseRESTAPITestCase):

    base_name = 'country'
    factory_class = CountryFactory
    serializer_class = CountrySerializer
    user_factory = UserFactory
    create_data = {'name': 'Brazil', 'provinces': [], 'towns': []}
    update_data = {'name': 'Australia'}


class ProvinceTestCase(MascrefAPITestCase, BaseRESTAPITestCase):

    base_name = 'province'
    factory_class = ProvinceFactory
    serializer_class = ProvinceSerializer
    user_factory = UserFactory
    update_data = {'name': 'Queensland'}

    def setUp(self):
        self.country = CountryFactory.create()
        super(ProvinceTestCase, self).setUp()

    def get_create_data(self):
        return {
            'name': 'Santa Catarina',
            'country': self.country.pk,
            'towns': []
        }


class TownTestCase(MascrefAPITestCase, BaseRESTAPITestCase):

    base_name = 'town'
    factory_class = TownFactory
    serializer_class = TownSerializer
    user_factory = UserFactory
    update_data = {'name': 'Brisbane'}

    def setUp(self):
        self.country = CountryFactory.create()
        self.province = ProvinceFactory.create()
        super(TownTestCase, self).setUp()

    def get_create_data(self):
        return {
            'name': 'Florianopolis',
            'country': self.country.pk,
            'province': self.province.pk,
            'sites': []
        }


class SiteTestCase(MascrefAPITestCase, BaseRESTAPITestCase):

    base_name = 'site'
    factory_class = SiteFactory
    serializer_class = SiteSerializer
    user_factory = UserFactory
    update_data = {'name': 'Muaivuso Flats'}

    def setUp(self):
        self.town = TownFactory.create()
        super(SiteTestCase, self).setUp()

    def get_create_data(self):
        return {
            'name': 'Florianopolis',
            'lat': -18.15,
            'long': 178.4,
            'town': self.town.pk,
            'transects': [],
        }


class ProjectTestCase(MascrefAPITestCase, BaseRESTAPITestCase):

    base_name = 'project'
    factory_class = ProjectFactory
    serializer_class = ProjectSerializer
    user_factory = UserFactory
    update_data = {'name': 'MS306'}

    # def setUp(self):
    #     self.town = TownFactory.create()
    #     super(SiteTestCase, self).setUp()

    def get_create_data(self):
        return {
            'name': 'MS 306',
            'description': 'Lorem ipsum',
            'surveys': []
        }


class SurveyTestCase(MascrefAPITestCase, BaseRESTAPITestCase):

    base_name = 'survey'
    factory_class = SurveyFactory
    serializer_class = SurveySerializer
    user_factory = UserFactory
    update_data = {'name': 'MS306'}

    def setUp(self):
        self.project = ProjectFactory.create()
        super(SurveyTestCase, self).setUp()

    def get_create_data(self):
        return {
            'project': self.project.pk,
            'name': '2015 First Semester',
            'date_start': '2015-01-01',
        }


class ResearcherTestCase(MascrefAPITestCase, BaseRESTAPITestCase):

    base_name = 'researcher'
    factory_class = ResearcherFactory
    serializer_class = ResearcherSerializer
    user_factory = UserFactory
    update_data = {'name': 'Australia'}

    def setUp(self):
        self.user = UserFactory.create()
        super(ResearcherTestCase, self).setUp()

    def get_create_data(self):
        return {
            'name': 'Davi Candido',
            'user': self.user.pk
        }


class StatsTestCase(TestCase):
    object = StatsFactory.build()

    def test_stats(self):
        self.assertTrue(isinstance(self.object.projects, int))
        self.assertTrue(isinstance(self.object.surveys, int))
        self.assertTrue(isinstance(self.object.countries, int))
        self.assertTrue(isinstance(self.object.provinces, int))
        self.assertTrue(isinstance(self.object.towns, int))
        self.assertTrue(isinstance(self.object.sites, int))
