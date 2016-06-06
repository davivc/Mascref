'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services')
.service('Group', function Group(Rest) {
  var service = {
    'url': "/groups/",
    'url_categories': "/groups_categories/",
    'list': function (parent, type, category) {
      var query = [];
      var qStr = '';
      if (parent) query.push('parent=' + parent);
      if (type) query.push('type=' + type);
      if (category) query.push('category=' + category);
      if (query.length > 1) qStr = '?' + query.join('&');
      else if (query.length == 1) qStr = '?' + query[0];
      return Rest.get(this.url + qStr);
    },
    'get': function (pk) {
      return Rest.get(this.url + pk);
    },
    'getCategories': function (type) {
      var qStr = '';
      if (type) qStr = '?type='+type;
      return Rest.get(this.url_categories + qStr);
    },
    'create': function (pData) {
      var data = {
        'name': pData.name,
        'project': pData.project,
        'date_start': pData.date_start,
        'date_end': pData.date_end,
        'public': pData.restricted,
        'owner': pData.owner.id
      }
      return Rest.post(this.url, data);
    }
  }

  return service;
});