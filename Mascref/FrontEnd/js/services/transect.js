'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services')
.service('Transect', function Transect(Rest) {
  var service = {
    'url': "/transects/",
    'url_infos': "/transects_infos/",
    'list': function (survey) {
      var qStr = '?';
      // if (search) qStr = qStr + 'search=' + search
      if (survey) qStr = qStr + 'survey=' + survey
      return Rest.get(this.url + qStr);
    },
    'get': function (pk) {
      return Rest.get(this.url + pk + "/");
    },
    'getInfo': function (transectId, infoToken) {
      var nameFilter = '';
      if(infoToken) nameFilter = "&name=" + infoToken;
      return Rest.get(this.url_infos + "?transect=" + transectId + nameFilter);
    },
    'save': function (pData) {
      var data = {
        'name': pData.name,
        'survey': pData.survey,
        'site': pData.site.id,
        'date': pData.date,
        'time_start': pData.time_start,          
        //'team_leader': pData.team_leader.id ? pData.team_leader.id : '',
        'depth': pData.depth
      }
      if (pData.id) return Rest.patch(this.url + pData.id + "/", data);
      else return Rest.post(this.url, data);
    },
    'saveInfo': function (pData) {
      var data = {
        'transect': pData.transect,
        'name': pData.name,
        'value': pData.value
      }
      if (pData.id) return Rest.patch(this.url_infos + pData.id + "/", data);
      else return Rest.post(this.url_infos, data);
    },
  }

  return service;
});