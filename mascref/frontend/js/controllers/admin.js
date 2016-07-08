'use strict';

/* Dashboard Controllers */

angular.module('app.controllers')
  .controller('AdminCtrl', ['$scope', '$translate', '$state','$stateParams','MASCREF_CONF', function ($scope, $translate, $state,$stateParams, MASCREF_CONF) {
  
    // Logged status
    if (!$scope.authenticated) {
      $state.go('access.signin');
    }
    // console.log($state)
    if($state.current.name == 'admin') {
      $state.go('admin.dashboard'); 
    }

  }]);