'use strict';

/* Dashboard Controllers */

angular.module('app.controllers')
  .controller('AdminCtrl', ['$scope', '$translate', '$state','MASCREF_CONF', function ($scope, $translate, $state, MASCREF_CONF) {
  
    // Logged status
    if (!$scope.authenticated) {
      $state.go('access.signin');
    }
    else {
      console.log('admin.dashboard')
      $state.go('admin.dashboard'); 
    }

  }]);