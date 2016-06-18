"""
Model tests.
"""
from mascref.testcases import MascrefModelTestCase
from unittest import TestCase

from models import Country
from models import Province
from models import Town
from models import Site
from models import Project
from models import Survey
from models import Researcher

from factories import CountryFactory
from factories import ProvinceFactory
from factories import TownFactory
from factories import SiteFactory
from factories import ProjectFactory
from factories import SurveyFactory
from factories import ResearcherFactory


class CountryTestCase(MascrefModelTestCase, TestCase):
    verbose_name_plural = 'countries'
    model_class = Country
    object = CountryFactory.build()

    def test_property_sites(self):
        self.assertTrue(isinstance(self.get_object().sites, (list, tuple)))

    def test_property_surveys(self):
        self.assertTrue(isinstance(self.get_object().surveys, (list, tuple)))

    def test_property_transects(self):
        self.assertTrue(isinstance(self.get_object().transects, (list, tuple)))


class ProvinceTestCase(MascrefModelTestCase, TestCase):
    verbose_name_plural = 'provinces'
    model_class = Province
    object = ProvinceFactory.build()

    # def setUp(self):
    #     self.country = CountryFactory.build()
    #     super(ProvinceTestCase, self).setUp()

    # def get_object(self):
    #     return Province(
    #       name='Brazil',
    #       country=self.country,
    #     )

    def test_property_sites(self):
        self.assertTrue(isinstance(self.get_object().sites, (list, tuple)))

    def test_property_surveys(self):
        self.assertTrue(isinstance(self.get_object().surveys, (list, tuple)))

    def test_property_transects(self):
        self.assertTrue(isinstance(self.get_object().transects, (list, tuple)))


class TownTestCase(MascrefModelTestCase, TestCase):
    verbose_name_plural = 'towns'
    model_class = Town
    object = TownFactory.build()

    # def setUp(self):
    #     self.country = CountryFactory.build()
    #     self.province = ProvinceFactory.build()
    #     super(TownTestCase, self).setUp()

    # def get_object(self):
    #     return Town(
    #       name='Brazil',
    #       country=self.country,
    #       province=self.province,
    #     )

    def test_property_surveys(self):
        self.assertTrue(isinstance(self.get_object().surveys, (list, tuple)))

    def test_property_transects(self):
        self.assertTrue(isinstance(self.get_object().transects, (list, tuple)))


class SiteTestCase(MascrefModelTestCase, TestCase):
    verbose_name_plural = 'sites'
    model_class = Site
    object = SiteFactory.build()

    # def setUp(self):
    #     self.town = TownFactory.build()
    #     super(SiteTestCase, self).setUp()

    # def get_object(self):
    #     return Site(
    #       name='Arvoredo Flats',
    #       lat=-27.456,
    #       long=-48.456,
    #       town=self.town,
    #     )

    def test_property_surveys(self):
        self.assertTrue(isinstance(self.get_object().surveys, (list, tuple)))


class ProjectTestCase(MascrefModelTestCase, TestCase):
    verbose_name_plural = 'projects'
    model_class = Project
    object = ProjectFactory.build()


class SurveyTestCase(MascrefModelTestCase, TestCase):
    verbose_name_plural = 'surveys'
    model_class = Survey
    object = SurveyFactory.build()


class ResearcherTestCase(MascrefModelTestCase, TestCase):
    verbose_name_plural = 'researchers'
    model_class = Researcher
    object = ResearcherFactory.build()
