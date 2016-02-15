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
    user = models.ForeignKey(User, blank=True, null=True)
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

    class Meta:
        ordering = ('name',)

    def __unicode__(self):
        return '%s' % (self.name)


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

    @property
    def surveys_count(self):
        return self.surveys.all().count()

    @property
    def transects_count(self):
        total = 0
        for survey in self.surveys.all():
            total += survey.transects_count
        return total


class Survey(models.Model):
    name = models.CharField(max_length=150)
    date_start = models.DateField()
    date_end = models.DateField(blank=True, null=True)
    project = models.ForeignKey(Project, related_name='surveys')
    public = models.BooleanField(default=False)
    owner = models.ForeignKey(Researcher, blank=True, null=True)
    created_by = models.ForeignKey(User, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('name',)

    def __unicode__(self):
        return '%s' % (self.name)

    @property
    def transects_count(self):
        return self.transects.all().count()

    @property
    def sites(self):
        sites = []
        for my_site in self.transects.all().values('site__id').distinct():
            sites.append(Site.objects.get(pk=my_site['site__id']))
            # sites.append(my_site['site__id'])
        return sites


class Transect(models.Model):
    survey = models.ForeignKey(Survey, related_name='transects')
    site = models.ForeignKey(Site)
    name = models.CharField(max_length=150)
    depth = models.FloatField()
    date = models.DateField(blank=True, null=True)
    time_start = models.TimeField(blank=True, null=True)
    team_leader = models.ForeignKey(Researcher, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return '%s' % (self.name)


class Transect_Researchers(models.Model):
    transect = models.ForeignKey(Transect)
    researcher = models.ForeignKey(Researcher)


class Transect_Type(models.Model):
    name = models.CharField(max_length=100)


class Transect_Info(models.Model):
    transect = models.ForeignKey(Transect)
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=255,blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


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