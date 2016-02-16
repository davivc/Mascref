'use strict';

/* Transect Controllers */

angular.module('app.controllers')
  .controller('SettingsCtrl', 
    [
      '$scope', 
      '$translate', 
      '$state',
      'Country',
      function (
          $scope, 
          $translate, 
          $state,
          Country
      ){
        // Logged status
        if (!$scope.authenticated) {
          $state.go('access.signin');
        }

        // Init
        $scope.accordions = [
          { template: 'tpl/app_settings_countries.html' },
        ];
      }
    ]
  );