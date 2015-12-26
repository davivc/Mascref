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
.filter('toPrecision', function () {
  return function (input, digits) {
    return (!!input && isFinite(input)) ? parseFloat(input).toPrecision(digits) : '';
  }
})
.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}])
.filter('sum', function () {
  return function (data, key) {    
    if (angular.isUndefined(data) || data.length == 0)
      return 0;
    var sum = 0;
    angular.forEach(data, function (v, k) {
      var val = 0;
      if (key !== "" && key !== null && key !== undefined) val = parseFloat(v[key]);
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
    var totalObjects = 0;
    angular.forEach(data, function (v, k) {
      var val = 0;
      if (key) val = parseFloat(v[key]);
      else val = parseFloat(v);

      if (isFinite(val)) {
        sum += val;
        totalObjects++;
      }
    });
    return sum / totalObjects;
  }
}).filter('sd', function () {
  return function (data, key) {
    if (angular.isUndefined(data))
      return 0;

    var sum = 0;
    var sumDeviation = 0;
    var mean = 0;
    var mean = 0;
    var totalObjects = 0;
    angular.forEach(data, function (v, k) {
      var val = 0;
      if (key) val = parseFloat(v[key]);
      else val = parseFloat(v);

      if (isFinite(val)) {
        sum += val;
        totalObjects++;
      }
    });

    mean = sum / totalObjects;
    angular.forEach(data, function (v, k) {
      var val = 0;
      if (key) val = parseFloat(v[key]);
      else val = parseFloat(v);

      if (isFinite(val)) sumDeviation += Math.pow(val - mean,2);
    });
    
    var dof = (totalObjects - 1) == 0 ? totalObjects : (totalObjects - 1);
    return Math.sqrt(sumDeviation/dof);
  }
});