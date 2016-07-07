"""
Definition of models.
"""
from django.db import models
from django.contrib.auth.models import User


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
        verbose_name_plural = "countries"
        ordering = ('name',)

    def __unicode__(self):
        return '%s' % (self.name)

    @property
    def sites(self):
        sites = []
        for _town in self.towns.all():
            for _item in _town.sites.all():
                sites.append(_item.id)
        return sites

    @property
    def surveys(self):
        surveys = []
        for _town in self.towns.all():
            for _site in _town.sites.all():
                for _transect in _site.transects.all():
                    surveys.append(_transect.survey_id)
        return sorted(set(surveys))

    @property
    def transects(self):
        transects = []
        for _town in self.towns.all():
            for _site in _town.sites.all():
                for _transect in _site.transects.all():
                    transects.append(_transect.id)
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
        return sites

    @property
    def surveys(self):
        surveys = []
        for _town in self.towns.all():
            for _site in _town.sites.all():
                for _transect in _site.transects.all():
                    surveys.append(_transect.survey_id)
        return sorted(set(surveys))

    @property
    def transects(self):
        transects = []
        for _town in self.towns.all():
            for _site in _town.sites.all():
                for _transect in _site.transects.all():
                    transects.append(_transect.id)
        return transects


class Town(models.Model):
    name = models.CharField(max_length=150)
    province = models.ForeignKey(
        Province, blank=True, null=True, related_name='towns'
    )
    country = models.ForeignKey(Country, related_name='towns')

    def __unicode__(self):
        return unicode(self.name)

    class Meta:
        ordering = ('name',)


    @property
    def surveys(self):
        surveys = []
        for _site in self.sites.all():
            for _transect in _site.transects.all():
                surveys.append(_transect.survey_id)
        return sorted(set(surveys))

    @property
    def transects(self):
        transects = []
        for _site in self.sites.all():
            for _transect in _site.transects.all():
                transects.append(_transect.id)
        return transects


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

    @property
    def surveys(self):
        surveys = []
        for _transect in self.transects.all():
            surveys.append(_transect.survey_id)
        return sorted(set(surveys))


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


class ProjectConfig(models.Model):
    project = models.ForeignKey(Project, related_name='configs')
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=100)


class Survey(models.Model):
    project = models.ForeignKey(Project, related_name='surveys')
    name = models.CharField(max_length=150)
    date_start = models.DateField()
    date_end = models.DateField(blank=True, null=True)
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
        return sites

# class SurveySites(models.Model):
#     survey = models.ForeignKey(Survey, related_name='sites')
#     site = models.ForeignKey(Site, related_name='sites')

class SurveyConfig(models.Model):
    survey = models.ForeignKey(Survey, related_name='configs')
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=100)

