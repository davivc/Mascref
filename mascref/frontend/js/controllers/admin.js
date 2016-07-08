'use strict';

/* Dashboard Controllers */

angular.module('app.controllers')
  .controller('AdminCtrl', ['$scope', '$translate', '$state','$stateParams','MASCREF_CONF', 'AclService', 'djangoAuth', function ($scope, $translate, $state,$stateParams, MASCREF_CONF, AclService, djangoAuth) {
  
    // Logged status
    if (!$scope.authenticated) {
      $state.go('access.signin');
    }
    // console.log($state)
    if($state.current.name == 'admin') {
      $state.go('admin.dashboard'); 
    }

    // djangoAuth.profile().then(function (data) {
    //   // console.log(data.userprofile.roles[0])
    //   AclService.attachRole(data.userprofile.roles[0])
    // }, function (error) {
          
    // });

    $scope.can = AclService.can;
  }]);