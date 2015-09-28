﻿"""
Definition of models.
"""

from django.db import models

# Create your models here.

class Configs(models.Model):
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=100)


class Researcher(models.Model):
    name = models.CharField(max_length=100)


class Country(models.Model):
    name = models.CharField(max_length=100)


class Province(models.Model):
    name = models.CharField(max_length=150)
    country = models.ForeignKey(Country)


class Town(models.Model):
    name = models.CharField(max_length=150)
    province = models.ForeignKey(Province, blank=True, null=True)
    country = models.ForeignKey(Country)


class Site(models.Model):
    name = models.CharField(max_length=150)
    lat = models.IntegerField()
    long = models.IntegerField()
    town = models.ForeignKey(Town, blank=True, null=True)


class Project(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', blank=True, null=True)


class Survey(models.Model):
    date_start = models.DateField()
    date_end = models.DateField(blank=True, null=True)
    project = models.ForeignKey(Project)


class Transect(models.Model):
    name = models.CharField(max_length=150)
    depth = models.IntegerField()
    date = models.DateField(blank=True, null=True)
    time_start = models.TimeField(blank=True, null=True)
    team_leader = models.ForeignKey(Researcher, blank=True, null=True)
    site = models.ForeignKey(Site)
    survey = models.ForeignKey(Survey)


class Transect_Researchers(models.Model):
    transect = models.ForeignKey(Transect)
    researcher = models.ForeignKey(Researcher)


class Transect_Type(models.Model):
    name = models.CharField(max_length=100)


class Group_Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)


class Group(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', blank=True, null=True)
    category = models.ForeignKey(Group_Category, blank=True, null=True)
    type = models.ForeignKey(Transect_Type)


class Segment(models.Model):
    segment = models.IntegerField()
    value = models.IntegerField()
    group = models.ForeignKey(Group, blank=True, null=True)
    transect = models.ForeignKey(Transect)
    type = models.ForeignKey(Transect_Type)