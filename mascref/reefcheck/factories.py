import datetime
import factory
import factory.fuzzy

from app.factories import SurveyFactory
from app.factories import SiteFactory

from models import TransectType
from models import GroupCategory
from models import GroupSet
from models import Group
from models import Transect
from models import TransectInfo
from models import Segment
from objects import Stats


class TransectTypeFactory(factory.DjangoModelFactory):
    class Meta:
        model = TransectType

    name = factory.Sequence(lambda n: 'Type {0}'.format(n))


class GroupCategoryFactory(factory.DjangoModelFactory):
    class Meta:
        model = GroupCategory

    name = factory.Sequence(lambda n: 'Category {0}'.format(n))
    type = factory.SubFactory(TransectTypeFactory)


class GroupSetFactory(factory.DjangoModelFactory):
    class Meta:
        model = GroupSet

    name = factory.Sequence(lambda n: 'Group Set {0}'.format(n))


class GroupFactory(factory.DjangoModelFactory):
    class Meta:
        model = Group

    set = factory.SubFactory(GroupSetFactory)
    type = factory.SubFactory(TransectTypeFactory)
    category = factory.SubFactory(GroupCategoryFactory)
    name = factory.Sequence(lambda n: 'Group {0}'.format(n))
    description = 'Lorem ipsum'
    format = 1


class TransectFactory(factory.DjangoModelFactory):
    class Meta:
        model = Transect

    survey = factory.SubFactory(SurveyFactory)
    site = factory.SubFactory(SiteFactory)
    name = factory.Sequence(lambda n: 'Transect {0}'.format(n))
    depth = factory.fuzzy.FuzzyDecimal(15.7)
    # print depth
    date = datetime.date(2015, 5, 1)
    time_start = datetime.time(10, 10, 0)
    time_end = datetime.time(14, 20, 0)


class TransectInfoFactory(factory.DjangoModelFactory):
    class Meta:
        model = TransectInfo

    transect = factory.SubFactory(TransectFactory)
    name = factory.Sequence(lambda n: 'name {0}'.format(n))
    value = 1
    description = 'Lorem ipsum'


class SegmentFactory(factory.DjangoModelFactory):
    class Meta:
        model = Segment

    token = factory.Sequence(lambda n: n)
    # token = '1_15_1_3'
    type = factory.SubFactory(TransectTypeFactory)
    transect = factory.SubFactory(TransectFactory)
    group = factory.SubFactory(GroupFactory)
    segment = 1
    value = 1


class StatsFactory(factory.Factory):
    class Meta:
        model = Stats

    transects = 1235
