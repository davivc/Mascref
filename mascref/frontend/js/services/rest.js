'use strict';

/* Rest Services */


// Demonstrate how to register services
angular.module('app.services')
.service('Rest', function Rest($q, $http, $cookies, ENV_CONF) {
  var service = {
    /* START CUSTOMIZATION HERE */
    // Change this to point to your Django REST Auth API
    // e.g. /api/rest-auth  (DO NOT INCLUDE ENDING SLASH)
    'API_URL': ENV_CONF.api_url,
    // Set use_session to true to use Django sessions to store security token.
    // Set use_session to false to store the security token locally and transmit it as a custom header.
    'use_session': true,
    /* END OF CUSTOMIZATION */
    'authenticated': null,
    'authPromise': null,
    'request': function (args) {
      // Let's retrieve the token from the cookie, if available
      if ($cookies.get('token')) {
        $http.defaults.headers.common.Authorization = 'Token ' + $cookies.get('token');
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
        headers: { 'X-CSRFToken': $cookies.get('csrftoken'), 'Content-Type': 'application/json' },
        // headers: { 'X-CSRFToken': $cookies.get('csrftoken') },
        params: params,
        data: data
      })
      .success(angular.bind(this, function (data, status, headers, config) {
        deferred.resolve(data, status);
      }))
      .error(angular.bind(this, function (data, status, headers, config) {
        // console.log("error syncing with: " + url);
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
        if (status == -1) {
          if (data == "") {
            data = {};
            data['status'] = -1;
            data['non_field_errors'] = ["Could not connect. Connection refused."];
          }
        }
        deferred.reject(data, status, headers, config);
      }));
      return deferred.promise;
    },
    'get': function (url) {
      return this.request({
        'method': "GET",
        'url': url
      });
    },
    'post': function (url, data) {
      return this.request({
        'method': "POST",
        'url': url,
        'data': data
      })
    },
    'patch': function (url, data) {
      return this.request({
        'method': "PATCH",
        'url': url,
        'data': data
      })
    },
    'put': function (url, data) {
      return this.request({
        'method': "PUT",
        'url': url,
        'data': data
      })
    },
    'delete': function (url, pk) {
      return this.request({
        'method': "DELETE",
        'url': url + pk + '/'
      })
    }
  }

  return service;
});