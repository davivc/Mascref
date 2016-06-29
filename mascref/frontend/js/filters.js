'use strict';

/* Filters */
// need load the moment.js to use this filter. 
angular.module('app.filters', [])
.filter('spaceless',function() {
    return function(input) {
        if (input) {
            return input.replace(/\s+/g, '_');    
        }
    }
})
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
.filter('toActivity', function () {
  return function (input) {
    var text = input.match(/\/api\/(.*?)\//);
    text = text[1];
    text = text.slice(0, -1);
    if(text.indexOf('countrie') >= 0) text = 'country';
    return text;
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
})
.filter('mean', function () {
  return function (data, key) {

    if (angular.isUndefined(data))
      return 0;
    var sum = 0;
    var totalObjects = 0;
    angular.forEach(data, function (v, k) {
      var val = 0;
      if (key) val = v[key];
      else val = v;

      if (isFinite(val)) {
        sum += parseFloat(val);
        totalObjects++;
      }
    });
    return sum / totalObjects;
  }
})
.filter('sd', function () {
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
})
.filter('range', function(){
  return function(n) {
    var res = [];
    for (var i = 0; i < n; i++) {
      res.push(i);
    }
    return res;
  };
})
.filter('coordinateFilter', ['$sce', function ($sce) {
  return function(coordinate, conversion, type, places) {
    // The filter will be running as we type values into the input boxes, which returns undefined
    // and brings up an error in the console. Here wait until the coordinate is defined
    if(coordinate != undefined) {

      // Check for user input that is a positive or negative number with the option
      // that it is a float. Match only the numbers and not the white space or other characters
      var pattern = /[-+]?[0-9]*\.?[0-9]+/g
      var match = String(coordinate).match(pattern);

      if(conversion === "toDD" && match && coordinateIsValid(match, type)) {
        // If the match array only has one item, the user has provided decimal degrees
        // and we can just return what the user typed in
        if(match.length === 1) {
          return parseFloat(match);
        }

        // If the match array has a length of three then we know degrees, minutes, and seconds
        // were provided so we can convert it to decimal degrees
        if(match.length === 3) {
          return toDecimalDegrees(match);
        }
      }

      else if(conversion === 'toDMS' && match && coordinateIsValid(match, type)) {
        // When converting from decimal degrees to degrees, minutes and seconds, if
        // the match array has one item we know the user has input decimal degrees
        // so we can convert it to degrees, minutes and seconds
        if(match.length === 1) {
          return toDegreesMinutesSeconds(match);
        }

        // To properly format the converted coordinates we will need to add in HTML entities
        // which means we'll need to bind the returned string as HTML and thus we need
        // to use $sce (Strict Contextual Escaping) to say that we trust what is being bound as HTML
        if(match.length === 3) {
          return $sce.trustAsHtml(match[0] + '&deg; ' + match[1] + '&prime; ' + match[2] + '&Prime; ');           
        }
      }

      // Output a notice that the coordinates are invalid if they are
      else if(!coordinateIsValid(match, type)) {
        return "Invalid Coordinate!";
      }    

      // Fix to firefox -> (function() {}());
      (function toDecimalDegrees(coord) {
        // Setup for all parts of the DMS coordinate and the necessary math to convert
        // from DMS to DD
        var degrees = parseInt(coord[0]);
        var minutes = parseInt(coord[1]) / 60;
        var seconds = parseFloat(coord[2]) / 3600;

        // When the degrees value is negative, the math is a bit different
        // than when the value is positive. This checks whether the value is below zero
        // and does subtraction instead of addition if it is. 
        // console.log(degrees, minutes, seconds)
        if(degrees < 0) {
          var calculated = degrees - minutes - seconds;

          // Correction with Google 0 degrees South and West
          // if(type == 'lat') calculated += 0.000261;
          if(type == 'lat') calculated += 0.000011;
          if(type == 'lon') calculated += 0.000011;
          return calculated.toFixed(places || 4);
        }
        else {
          var calculated = degrees + minutes + seconds

          // Correction with Google 0 degrees North and East
          // if(type == 'lat') calculated -= 0.000222;
          if(type == 'lat') calculated -= 0.000011;
          if(type == 'lon') calculated -= 0.000011;
          return calculated.toFixed(places || 4);
        }
      }());

      // This function converts from DD to DMS. Math.abs is used a lot because
      // for the minutes and seconds, negative values aren't valid 
      (function toDegreesMinutesSeconds(coordinate) {
        var degrees = coordinate[0].split('.')[0];
        var minutes = Math.abs(Math.floor(60 * (Math.abs(coordinate[0]) - Math.abs(degrees))));
        var seconds = (3600 * (Math.abs(coordinate[0]) - Math.abs(degrees) - Math.abs(minutes) / 60)).toFixed(1);

        //return $sce.trustAsHtml(degrees + '&deg; ' + minutes + '&prime; ' + seconds + '&Prime; ');
        return { deg: degrees, min: minutes, sec: seconds };    
      }());

      // This function checks whether the coordinate value the user enters is valid or not. 
      // If the coordinate doesn't pass one of these rules, the function will return false
      // which will then alert the user that the coordinate is invalid.
      (function coordinateIsValid(coordinate, type) {
        // if(coordinate) {

          // The degree values of latitude coordinates have a range between -90 and 90
          // if(coordinate[0] && type === 'lat') {
          //   if(!parseInt(coordinate[0]).between(-90, 90)) return false; 
          // }
          // // The degree values longitude coordinates have a range between -180 and 180
          // else if(coordinate[0] && type === 'lon') {
          //   if(!parseInt(coordinate[0]).between(-180, 180)) return false;
          // }
          // // Minutes and seconds can only be between 0 and 60
          // if(coordinate[1]) {
          //   if(!parseInt(coordinate[1]).between(0, 60)) return false;
          // }
          // if(coordinate[2]) {
          //   if(!parseInt(coordinate[2]).between(0, 60)) return false;
          // }                         
        // }
        
        // If the coordinate made it through all the rules above, the function
        // returns true because the coordinate is good
        return true;
      }());        
    }       
  }
}])