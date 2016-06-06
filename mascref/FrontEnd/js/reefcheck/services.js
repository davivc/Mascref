'use strict';

/* Services */


// Demonstrate how to register services
angular.module('reefcheck')
.service('reefCheckGroupSet', function reefCheckGroupSet(Rest) {
  var service = {
    'url': "/group_sets/",
    'list': function () {
      return Rest.get(this.url);
    },
    'get': function (pk) {
      return Rest.get(this.url + pk);
    },
    'create': function (pData) {
      var data = {
        'name': pData.name,
      }
      return Rest.post(this.url, data);
    }
  }

  return service;
});