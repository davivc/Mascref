import datetime
import factory
import factory.fuzzy

from mascref.factories import UserFactory
from models import Country
from models import Province
from models import Town
from models import Site
from models import Project
from models import Survey
from models import Researcher
from objects import Stats


class CountryFactory(factory.DjangoModelFactory):
    class Meta:
        model = Country

    name = factory.Sequence(lambda n: 'Country {0}'.format(n))


class ProvinceFactory(factory.DjangoModelFactory):
    class Meta:
        model = Province

    name = factory.Sequence(lambda n: 'Province {0}'.format(n))
    country = factory.SubFactory(CountryFactory)


class TownFactory(factory.DjangoModelFactory):
    class Meta:
        model = Town

    name = factory.Sequence(lambda n: 'Town {0}'.format(n))
    province = factory.SubFactory(ProvinceFactory)
    country = factory.SubFactory(CountryFactory)


class SiteFactory(factory.DjangoModelFactory):
    class Meta:
        model = Site

    name = factory.Sequence(lambda n: 'Site {0}'.format(n))
    lat = -18.15
    long = 178.4
    town = factory.SubFactory(TownFactory)


class ProjectFactory(factory.DjangoModelFactory):
    class Meta:
        model = Project

    name = factory.Sequence(lambda n: 'Project {0}'.format(n))
    description = "Lorem ipsum"


class SurveyFactory(factory.DjangoModelFactory):
    class Meta:
        model = Survey
        exclude = ('fd',)

    project = factory.SubFactory(ProjectFactory)
    name = factory.Sequence(lambda n: 'Survey {0}'.format(n))
    fd = factory.fuzzy.FuzzyDate(
        datetime.date(2015, 1, 1),
        datetime.date(2015, 6, 30)
    )
    # print date_start
    # print fd.start_date
    # date_start = fd.start_date
    # date_end = fd.end_date
    date_start = datetime.date(2015, 1, 1)
    date_end = datetime.date(2015, 6, 30)
    created_by = factory.SubFactory(UserFactory)


class ResearcherFactory(factory.DjangoModelFactory):
    class Meta:
        model = Researcher

    name = factory.Sequence(lambda n: 'Researcher {0}'.format(n))
    user = factory.SubFactory(UserFactory)


class StatsFactory(factory.Factory):
    class Meta:
        model = Stats

    projects = 45
    surveys = 32
    countries = 223
    provinces = 452
    sites = 238
    towns = 67
