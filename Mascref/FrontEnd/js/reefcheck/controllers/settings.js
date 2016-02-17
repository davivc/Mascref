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
    ['$scope','$timeout','Country', 'Province',
      function ($scope, $timeout, Country, Province){
        // Init
        $scope.placesBlocks = [
          { template: 'tpl/reefcheck/settings/places_countries.html' },
          { template: 'tpl/reefcheck/settings/places_provinces.html' },
          { template: 'tpl/reefcheck/settings/places_towns.html' },
          { template: 'tpl/reefcheck/settings/places_sites.html' },
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

        // Provinces Begin ----------------------------------------------- 
        $scope.loadingProvinces = false;
        $scope.provinces = {}

        $scope.getProvinces = function() {
          $scope.loadingProvinces = true;
          Province.list()
          .then(function (data) {            
            $scope.loadingProvinces = false;
            $scope.provinces = data;
            
            $timeout(function(){
                $('.table').trigger('footable_redraw');
            }, 100);
          }, function (error) {
            
          });
        }
        $scope.getProvinces();
        // Provinces End -------------------------------------------------
      }
    ]
  ).controller('ReefCheckSettingsGroupsCtrl', 
    ['$scope', 
      function ($scope){
        // Init


      }
    ]
  );