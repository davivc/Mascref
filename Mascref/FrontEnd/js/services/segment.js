'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services')
.service('Segment', function Segment(Rest) {
  var service = {
    'url': "/segments/",
    'list': function (transect, type, segment) {
      var query = [];
      var qStr = '';
      if (transect) query.push('transect=' + transect);
      if (type) query.push('type=' + type);
      if (segment) query.push('segment=' + segment);
      if (query.length > 0) qStr = '?' + query.join('&');
      return Rest.get(this.url + qStr);
    },
    'save': function (data) {
      if (data.created_at) return Rest.patch(this.url + data.token + "/", data);
      else return Rest.post(this.url, data);
      //return Rest.put(this.url + data.token + "/", data);
    }
  }

  return service;
});