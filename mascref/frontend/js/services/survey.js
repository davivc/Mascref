'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services')
.service('Surveys', function Surveys(Rest) {
  var service = {
    'url': "/surveys/",
    'list': function (project) {
      var query = [];
      var qStr = '';
      if (project) query.push('project=' + project);

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
          'project': pData.project,
          'date_start': pData.date_start,
          'date_end': pData.date_end,
          'public': pData.restricted,
          'data_level': pData.confidence,
          'owner': pData.owner.id
      };
      if(pData.id) {
        data.public = pData.public;
        return Rest.patch(this.url + pData.id + '/', data); 
      }
      else {
        return Rest.post(this.url, data);
      }
    },
    'delete': function (pk) {
      return Rest.delete(this.url, pk);
    }
  }

  return service;
});