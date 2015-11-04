"""
Definition of views.
"""

from django.shortcuts import render
from django.shortcuts import render_to_response
from django.http import HttpRequest
from django.template import RequestContext
from datetime import datetime
from Mascref.serializers import ConfigSerializer


def home(request):
    """Renders the home page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/index.html',
        context_instance = RequestContext(request,
        {
            'title':'Home Page',
            'year':datetime.now().year,
        })
    )

