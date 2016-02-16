'use strict';

/* Transect Controllers */

angular.module('reefcheck.controllers', [])
  .controller('ReefCheckSettingsCtrl', 
    [
      '$scope', 
      '$translate', 
      '$state',
      function (
          $scope, 
          $translate, 
          $state
      ){

        // Init
        $scope.blocks = [
          { template: 'tpl/reefcheck/settings/maps.html' },
          { template: 'tpl/reefcheck/settings/places.html' },
          { template: 'tpl/reefcheck/settings/groups.html' },
        ];
      }
    ]
  );