'use strict';

/* Transect Controllers */

angular.module('reefcheck.controllers', [])
  .controller('ReefCheckSettingsCtrl', 
    ['$scope','Country', 
      function ($scope, Country){
        // Init
        $scope.blocks = [
          { template: 'tpl/reefcheck/settings/transects.html'},
          { template: 'tpl/reefcheck/settings/places.html' },
          { template: 'tpl/reefcheck/settings/groups.html' },
        ];     
      }
    ]
  ).controller('ReefCheckSettingsTransectsCtrl', 
    ['$scope', 
      function ($scope){
        // Init
        $scope.config = {
          length: 20,
          distance: 5,
          points: 40
        }


      }
    ]
  ).controller('ReefCheckSettingsPlacesCtrl', 
    ['$scope','$timeout','Country', 
      function ($scope, $timeout, Country){
        // Init
        $scope.placesBlocks = [
          { template: 'tpl/reefcheck/settings/places_countries.html' },
        ];
        console.log('ReefCheckSettingsPlacesCtrl')
        // Countries Begin ----------------------------------------------- 
        $scope.loadingCountries = false;
        $scope.countries = {}

        $scope.getCountries = function() {
          $scope.loadingCountries = true;
          Country.list()
          .then(function (data) {            
            $scope.loadingCountries = false;
            $scope.countries = data;
            
            $timeout(function(){
                $('.table').trigger('footable_redraw');
            }, 100);
          }, function (error) {
            
          });
        }
        $scope.getCountries();
        // Countries End -------------------------------------------------
      }
    ]
  ).controller('ReefCheckSettingsGroupsCtrl', 
    ['$scope', 
      function ($scope){
        // Init


      }
    ]
  );