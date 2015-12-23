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
})
.filter('sum', function () {
  return function (data, key) {
    if (angular.isUndefined(data))
      return 0;
    var sum = 0;
    angular.forEach(data, function (v, k) {
      var val = 0;
      if (key) val = parseFloat(v[key]);
      else val = parseFloat(v);

      if (isFinite(val)) sum += val;
    });
    return sum;
  }
}).filter('mean', function () {
  return function (data, key) {

    if (angular.isUndefined(data))
      return 0;
    var sum = 0;
    angular.forEach(data, function (v, k) {
      var val = 0;
      if (key) val = parseFloat(v[key]);
      else val = parseFloat(v);

      if (isFinite(val)) sum += val;
    });
    return sum/Object.keys(data).length;
  }
}).filter('sd', function () {
  return function (data, key) {
    if (angular.isUndefined(data))
      return 0;

    var sum = 0;
    var sumDeviation = 0;
    var mean = 0;
    var mean = 0;
    angular.forEach(data, function (v, k) {
      var val = 0;
      if (key) val = parseFloat(v[key]);
      else val = parseFloat(v);

      if (isFinite(val)) sum += val;
    });

    mean = sum / Object.keys(data).length;
    angular.forEach(data, function (v, k) {
      var val = 0;
      if (key) val = parseFloat(v[key]);
      else val = parseFloat(v);

      if (isFinite(val)) sumDeviation += Math.pow(val - mean,2);
    });
    
    var dof = (Object.keys(data).length - 1) == 0 ? Object.keys(data).length : (Object.keys(data).length - 1);
    return Math.sqrt(sumDeviation/dof);
  }
});