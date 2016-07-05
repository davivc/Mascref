"""
Definition of models.
"""
from django.db import models
from django.contrib.auth.models import User
from app.models import Project
from app.models import Survey
from app.models import Site
from app.models import Researcher


class TransectType(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ('name',)

    def __unicode__(self):
        return '%s' % (self.name)


class GroupCategory(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    type = models.ForeignKey(TransectType)

    class Meta:
        verbose_name_plural = "group categories"
        ordering = ('name',)

    def __unicode__(self):
        return '%s' % (self.name)


class GroupSet(models.Model):
    name = models.CharField(max_length=100)

    def __unicode__(self):
        return '%s' % (self.name)


class Group(models.Model):
    set = models.ForeignKey(GroupSet)
    type = models.ForeignKey(TransectType)
    category = models.ForeignKey(GroupCategory, blank=True, null=True)
    parent = models.ForeignKey(
        'self', blank=True, null=True, related_name='sub_groups'
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    format = models.IntegerField(default=1)
    projects = models.ManyToManyField(Project)

    def __unicode__(self):
        return '%s' % (self.name)


class Transect(models.Model):
    survey = models.ForeignKey(Survey, related_name='transects')
    site = models.ForeignKey(Site, related_name='transects')
    name = models.CharField(max_length=150)
    depth = models.FloatField()
    date = models.DateField(blank=True, null=True)
    time_start = models.TimeField(blank=True, null=True)
    time_end = models.TimeField(blank=True, null=True)
    team_leader = models.ForeignKey(Researcher, blank=True, null=True)
    # members = models.ManyToManyField(
    #     Researcher, related_name="members"
    # )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return '%s' % (self.name)


class TransectInfo(models.Model):
    transect = models.ForeignKey(Transect)
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class TransectMemberRole(models.Model):
    name = models.CharField(max_length=100)


class TransectMembers(models.Model):
    transect = models.ForeignKey(Transect)
    researcher = models.ForeignKey(Researcher)
    role = models.ForeignKey(TransectMemberRole)


class Segment(models.Model):
    token = models.CharField(primary_key=True, max_length=100)
    type = models.ForeignKey(TransectType)
    transect = models.ForeignKey(Transect)
    group = models.ForeignKey(Group, blank=True, null=True)
    segment = models.IntegerField()
    value = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
