'use strict';

/* Transect Controllers */

angular.module('app.controllers')
  .controller('SettingsCtrl', 
    [
      '$scope', 
      '$translate', 
      '$state',
      function (
          $scope, 
          $translate, 
          $state
      ){
        // Logged status
        if (!$scope.authenticated) {
          $state.go('access.signin');
        }

        // Init

        $scope.modules = [
          { 
            name: 'ReefCheck', 
            templateSettings: 'tpl/reefcheck/settings/block.html'
          },
          { 
            name: 'Maps', 
            templateSettings: 'tpl/maps/settings/block.html'
          },
          { 
            name: 'Stats', 
            templateSettings: 'tpl/maps/stats/block.html'
          }
        ];

        console.log($scope.modules)
        // $scope.accordions = [
        //   { template: 'tpl/app_settings_countries.html' },
        // ];
      }
    ]
  );