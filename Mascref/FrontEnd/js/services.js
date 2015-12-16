'use strict';

/* Services */


// Demonstrate how to register services
angular.module('app.services', [])
  .service('Rest', function rest($q, $http, $cookies) {
    var service = {
      /* START CUSTOMIZATION HERE */
      // Change this to point to your Django REST Auth API
      // e.g. /api/rest-auth  (DO NOT INCLUDE ENDING SLASH)
      'API_URL': 'http://mascref:53190/api',
      // Set use_session to true to use Django sessions to store security token.
      // Set use_session to false to store the security token locally and transmit it as a custom header.
      'use_session': true,
      /* END OF CUSTOMIZATION */
      'authenticated': null,
      'authPromise': null,
      'request': function (args) {
        // Let's retrieve the token from the cookie, if available
        if ($cookies.token) {
          $http.defaults.headers.common.Authorization = 'Token ' + $cookies.token;
        }
        // Continue
        params = args.params || {}
        args = args || {};
        var deferred = $q.defer(),
            url = this.API_URL + args.url,
            method = args.method || "GET",
            params = params,
            data = args.data || {};
        // Fire the request, as configured.
        $http({
          url: url,
          withCredentials: this.use_session,
          method: method.toUpperCase(),
          headers: { 'X-CSRFToken': $cookies['csrftoken'] },
          params: params,
          data: data
        })
        .success(angular.bind(this, function (data, status, headers, config) {
          deferred.resolve(data, status);
        }))
        .error(angular.bind(this, function (data, status, headers, config) {
          console.log("error syncing with: " + url);
          // Set request status
          if (data) {
            data.status = status;
          }
          if (status == 0) {
            if (data == "") {
              data = {};
              data['status'] = 0;
              data['non_field_errors'] = ["Could not connect. Please try again."];
            }
            // or if the data is null, then there was a timeout.
            if (data == null) {
              // Inject a non field error alerting the user
              // that there's been a timeout error.
              data = {};
              data['status'] = 0;
              data['non_field_errors'] = ["Server timed out. Please try again."];
            }
          }
          deferred.reject(data, status, headers, config);
        }));
        return deferred.promise;
      }
    }

    return service;
  })
  .service('Dashboard', function Dashboard(Rest) {
    var service = {      
      'stats': function () {
        return Rest.request({
          'method': "GET",
          'url': "/dashboard/stats/"
        });
      },
      'researchers': function () {
        return Rest.request({
          'method': "GET",
          'url': "/researchers/"
        });
      },
    }

    return service;
  }).service('Projects', function Projects(Rest) {
    var service = {      
      'list': function (parent) {
        var search = '?';
        if(parent) search = search  + 'parent=' + parent
        return Rest.request({
          'method': "GET",
          'url': "/projects/" + search
        });
      },
      'get': function (projectId) {
        return Rest.request({
          'method': "GET",
          'url': "/projects/" + projectId + "/"
        });
      }
    }

    return service;
  }).service('Surveys', function Surveys(Rest) {
    var service = {
      'list': function (project) {
        var search = '?';
        if (project) search = search + 'project=' + project
        return Rest.request({
          'method': "GET",
          'url': "/surveys/" + search
        });
      },
      'get': function (surveyId) {
        return Rest.request({
          'method': "GET",
          'url': "/surveys/" + surveyId + "/"
        });
      }
    }

    return service;
  });