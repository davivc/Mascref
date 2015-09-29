from django.contrib import admin

from .models import Config
from .models import Researcher
from .models import Country
from .models import Province
from .models import Town
from .models import Country
from .models import Site
from .models import Project
from .models import Survey
from .models import Transect
from .models import Transect_Researchers
from .models import Transect_Type
from .models import Group_Category
from .models import Group
from .models import Segment


admin.site.register(Config)
admin.site.register(Researcher)
admin.site.register(Country)
admin.site.register(Province)
admin.site.register(Town)
admin.site.register(Site)
admin.site.register(Project)
admin.site.register(Survey)
admin.site.register(Transect)
admin.site.register(Transect_Researchers)
admin.site.register(Transect_Type)
admin.site.register(Group_Category)
admin.site.register(Group)
admin.site.register(Segment)