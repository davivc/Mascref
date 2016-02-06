'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services')
.service('User', function User(Rest) {
  var service = {
    'url': "/users/",
    'list': function (segment) {
      return Rest.get(this.url);
    },
    'get': function (pk) {
      return Rest.get(this.url + pk + "/");
    },
  }

  return service;
});