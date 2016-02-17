from json import dumps

"""
Definition of models.
"""

from django.db import models
from django.contrib.auth.models import User
# from django.dispatch import receiver
# from django.db.models.signals import pre_delete


# Create your models here.

# Types and Categories
class Transect_Type(models.Model):
    name = models.CharField(max_length=100)

    def __unicode__(self):
        return '%s' % (self.name)


class Group_Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    type = models.ForeignKey(Transect_Type, default=1)

    def __unicode__(self):
        return '%s' % (self.name)


class Group_Set(models.Model):
    name = models.CharField(max_length=100)

    def __unicode__(self):
        return '%s' % (self.name)


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


    @property
    def sites(self):
        sites = []
        for _town in self.towns.all():
            for _item in _town.sites.all():
               sites.append(_item.id)
        # print len(sites)
        return sites


    @property
    def surveys(self):
        surveys = []
        for _town in self.towns.all():
            for _site in _town.sites.all():
                for _transect in _site.transects.all():
                    surveys.append(_transect.survey_id)
        # print sorted(set(surveys))
        return sorted(set(surveys))


    @property
    def transects(self):
        transects = []
        for _town in self.towns.all():
            for _site in _town.sites.all():
                for _transect in _site.transects.all():
                    transects.append(_transect.id)
        # print len(sites)
        return transects


class Province(models.Model):
    name = models.CharField(max_length=150)
    country = models.ForeignKey(Country, related_name='provinces')

    class Meta:
        ordering = ('name',)

    def __unicode__(self):
        return '%s' % (self.name)


    @property
    def sites(self):
        sites = []
        for _town in self.towns.all():
            for _item in _town.sites.all():
               sites.append(_item.id)
        # print len(sites)
        return sites


    @property
    def surveys(self):
        surveys = []
        for _town in self.towns.all():
            for _site in _town.sites.all():
                for _transect in _site.transects.all():
                    surveys.append(_transect.survey_id)
        # print sorted(set(surveys))
        return sorted(set(surveys))


    @property
    def transects(self):
        transects = []
        for _town in self.towns.all():
            for _site in _town.sites.all():
                for _transect in _site.transects.all():
                    transects.append(_transect.id)
        # print len(sites)
        return transects


class Town(models.Model):
    name = models.CharField(max_length=150)
    province = models.ForeignKey(Province, blank=True, null=True, related_name='towns')
    country = models.ForeignKey(Country, related_name='towns')

    def __unicode__(self):
        return unicode(self.name)
    
    class Meta:
        ordering = ('name',)



class Site(models.Model):
    name = models.CharField(max_length=150)
    lat = models.FloatField()
    long = models.FloatField()
    town = models.ForeignKey(Town, blank=True, null=True, related_name='sites')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('name',)

    def __unicode__(self):
        return '%s' % (self.name)


class Group(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', blank=True, null=True, related_name='sub_groups')
    category = models.ForeignKey(Group_Category, blank=True, null=True)
    format = models.IntegerField(default=1)
    set = models.ForeignKey(Group_Set)
    type = models.ForeignKey(Transect_Type)

    def __unicode__(self):
        return '%s' % (self.name)


class Project(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)    
    parent = models.ForeignKey('self', blank=True, null=True)
    public = models.BooleanField(default=False)
    owner = models.ForeignKey(Researcher, blank=True, null=True)
    groups = models.ManyToManyField(Group, blank=True, null=True)
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
    site = models.ForeignKey(Site, related_name='transects')
    name = models.CharField(max_length=150)
    depth = models.FloatField()
    date = models.DateField(blank=True, null=True)
    time_start = models.TimeField(blank=True, null=True)
    team_leader = models.ForeignKey(Researcher, blank=True, null=True)
    members = models.ManyToManyField(Researcher, blank=True, null=True, related_name="members")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return '%s' % (self.name)


#class Transect_Researchers(models.Model):
#    transect = models.ForeignKey(Transect)
#    researcher = models.ForeignKey(Researcher)


class Transect_Info(models.Model):
    transect = models.ForeignKey(Transect)
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=255,blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Segment(models.Model):
    token = models.CharField(primary_key=True, max_length=100)
    segment = models.IntegerField()
    value = models.IntegerField(blank=True, null=True)
    group = models.ForeignKey(Group, blank=True, null=True)
    transect = models.ForeignKey(Transect)
    type = models.ForeignKey(Transect_Type)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# Signals
# @receiver(pre_delete, sender=Project)
# def pre_delete_project(sender, instance, **kwargs):
#     print instance