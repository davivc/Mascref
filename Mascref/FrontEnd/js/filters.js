'use strict';

/* Filters */
// need load the moment.js to use this filter. 
angular.module('app.filters', [])
  .filter('fromNow', function() {
    return function(date) {
      return moment(date).fromNow();
    }
  })
  .filter('ucFirst', function () {
    return function (input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.slice(1) : '';
    }
  })
  .filter('ucWords', function () {
    return function (input) {
      return (!!input) ? input.split(' ').map(function (wrd) { return wrd.charAt(0).toUpperCase() + wrd.substr(1).toLowerCase(); }).join(' ') : '';
    }
  });