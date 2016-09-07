'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services')
.service('Projects', function Projects(Rest) {
  var service = {
    'url': "/projects/",
    'list': function (parent) {
      var query = [];
      var qStr = '';
      if (parent) query.push('parent=' + parent);

      if (query.length > 1) qStr = '?' + query.join('&');
      else if (query.length == 1) qStr = '?' + query[0];
      return Rest.get(this.url + qStr);
    },
    'get': function (pk) {
      return Rest.get(this.url + pk + '/');
    },
    'save': function (pData) {
      var data = {
        'name': pData.name,
        'description': pData.description,
        'parent': pData.parent,
        'public': pData.restricted,
        'owner': pData.owner.id,
        'confidence': pData.confidence
      };
      if(pData.id) {
        data.surveys = pData.surveys;
        data.public = pData.public;
        return Rest.patch(this.url + pData.id + '/', data); 
      }
      else {
        data.surveys = [];
        return Rest.post(this.url, data);
      }
    },
    'delete': function (pk) {
      return Rest.delete(this.url, pk);
    }
  }

  return service;
});