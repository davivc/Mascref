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
            templateSettings: 'tpl/reefcheck/settings/block.html',
            open: ($state.current.name.indexOf('settings.reefcheck') > 0) ? true : false
          },
          { 
            name: 'Maps', 
            templateSettings: 'tpl/maps/settings/block.html',
            open: ($state.current.name.indexOf('settings.maps') > 0) ? true : false
          },
          { 
            name: 'Stats', 
            templateSettings: 'tpl/maps/stats/block.html',
            open: ($state.current.name.indexOf('settings.stats') > 0) ? true : false
          }
        ];
      }
    ]
  );