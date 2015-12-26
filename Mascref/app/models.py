"""
Definition of models.
"""

from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Config(models.Model):
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=100)


class Researcher(models.Model):
    name = models.CharField(max_length=100)
    eco_diver = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return '%s' % (self.name)


class Country(models.Model):
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ('name',)

    def __unicode__(self):
        return '%s' % (self.name)


class Province(models.Model):
    name = models.CharField(max_length=150)
    country = models.ForeignKey(Country)

    class Meta:
        ordering = ('name',)

    def __unicode__(self):
        return '%s' % (self.name)


class Town(models.Model):
    name = models.CharField(max_length=150)
    province = models.ForeignKey(Province, blank=True, null=True)
    country = models.ForeignKey(Country)

    class Meta:
        ordering = ('name',)

    def __unicode__(self):
        return '%s' % (self.name)


class Site(models.Model):
    name = models.CharField(max_length=150)
    lat = models.FloatField()
    long = models.FloatField()
    town = models.ForeignKey(Town, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Project(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)    
    parent = models.ForeignKey('self', blank=True, null=True)
    public = models.BooleanField(default=False)
    owner = models.ForeignKey(Researcher, blank=True, null=True)
    created_by = models.ForeignKey(User, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('name',)

    def __unicode__(self):
        return '%s' % (self.name)


class Survey(models.Model):
    name = models.CharField(max_length=150)
    date_start = models.DateField()
    date_end = models.DateField(blank=True, null=True)
    project = models.ForeignKey(Project)
    public = models.BooleanField(default=False)
    owner = models.ForeignKey(Researcher, blank=True, null=True)
    created_by = models.ForeignKey(User, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('name',)

    def __unicode__(self):
        return '%s' % (self.name)


class Transect(models.Model):
    name = models.CharField(max_length=150)
    depth = models.IntegerField()
    date = models.DateField(blank=True, null=True)
    time_start = models.TimeField(blank=True, null=True)
    team_leader = models.ForeignKey(Researcher, blank=True, null=True)
    site = models.ForeignKey(Site)
    survey = models.ForeignKey(Survey)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Transect_Researchers(models.Model):
    transect = models.ForeignKey(Transect)
    researcher = models.ForeignKey(Researcher)


class Transect_Type(models.Model):
    name = models.CharField(max_length=100)


class Group_Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    type = models.ForeignKey(Transect_Type, default=1)

    def __unicode__(self):
        return '%s' % (self.name)


class Group(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', blank=True, null=True, related_name='sub_groups')
    category = models.ForeignKey(Group_Category, blank=True, null=True)
    type = models.ForeignKey(Transect_Type, default=1)
    format = models.IntegerField(default=1)

    def __unicode__(self):
        return '%s' % (self.name)


class Segment(models.Model):
    token = models.CharField(primary_key=True, max_length=100)
    transect = models.ForeignKey(Transect)
    type = models.ForeignKey(Transect_Type)
    segment = models.IntegerField()
    value = models.IntegerField(blank=True, null=True)
    group = models.ForeignKey(Group, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)