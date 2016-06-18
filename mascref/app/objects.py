# Objects for non-Models api
class Stats(object):
    def __init__(self, projects, surveys, countries, provinces, towns, sites):
        self.projects = projects
        self.surveys = surveys
        self.countries = countries
        self.provinces = provinces
        self.towns = towns
        self.sites = sites
