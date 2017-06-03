'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services')
.service('Data', function Surveys(Rest) {
  var service = {
    'url_substrate': "/data_substrate/",
    'getSubstrate': function (format, show, filters) {
      var query = [];
      var qStr = '';
      if (format) query.push('format=' + format);
      if (show) query.push('show=' + show);
      if (filters) {
        if (filters.project) query.push('project=' + filters.project);
        if (filters.survey) query.push('survey=' + filters.survey);
        if (filters.year) query.push('year=' + filters.year);
        if (filters.country) query.push('country=' + filters.country);
        if (filters.site) query.push('site=' + filters.site);
      }
      if (query.length > 1) qStr = '?' + query.join('&');
      else if (query.length == 1) qStr = '?' + query[0];
      return Rest.get(this.url_substrate + qStr);
    }
  }

  return service;
});