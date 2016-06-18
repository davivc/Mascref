"""
Model tests.
"""
from mascref.testcases import MascrefModelTestCase
from unittest import TestCase
# from django.testcases import TestCase

from models import TransectType
from models import GroupCategory
from models import GroupSet
from models import Group
from models import Transect
from models import TransectInfo
from models import Segment

from factories import TransectTypeFactory
from factories import GroupCategoryFactory
from factories import GroupSetFactory
from factories import GroupFactory
from factories import TransectFactory
from factories import TransectInfoFactory
from factories import SegmentFactory


class TransectTypeTestCase(MascrefModelTestCase, TestCase):
    verbose_name_plural = 'transect types'
    model_class = TransectType
    object = TransectTypeFactory.build()


class GroupCategoryTestCase(MascrefModelTestCase, TestCase):
    verbose_name_plural = 'group categories'
    model_class = GroupCategory
    object = GroupCategoryFactory.build()


class GroupSetTestCase(MascrefModelTestCase, TestCase):
    verbose_name_plural = 'group sets'
    model_class = GroupSet
    object = GroupSetFactory.build()


class GroupTestCase(MascrefModelTestCase, TestCase):
    verbose_name_plural = 'groups'
    model_class = Group
    object = GroupFactory.build()


class TransectTestCase(MascrefModelTestCase, TestCase):
    verbose_name_plural = 'transects'
    model_class = Transect
    object = TransectFactory.build()


class TransectInfoTestCase(MascrefModelTestCase, TestCase):
    verbose_name_plural = 'transect infos'
    model_class = TransectInfo
    object = TransectInfoFactory.build()


class SegmentTestCase(MascrefModelTestCase, TestCase):
    verbose_name_plural = 'segments'
    model_class = Segment
    object = SegmentFactory.build()
