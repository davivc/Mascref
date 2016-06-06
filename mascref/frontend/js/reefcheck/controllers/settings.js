'use strict';

/* Transect Controllers */

angular.module('reefcheck')
  .controller('ReefCheckSettingsCtrl', 
    ['$scope','$state','Country', 
      function ($scope,$state, Country){
        // Init
        $scope.blocks = [
          { template: 'tpl/reefcheck/settings/transects.html', open: ($state.current.name.indexOf('reefcheck.transects') > 0) ? true : false },
          { template: 'tpl/reefcheck/settings/places.html', open: ($state.current.name.indexOf('reefcheck.places') > 0) ? true : false },
          { template: 'tpl/reefcheck/settings/groups.html', open: ($state.current.name.indexOf('reefcheck.groups') > 0) ? true : false },
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
    ['$scope','$state','$timeout','Country', 'Province', 'Town', 'Site',
      function ($scope, $state, $timeout, Country, Province, Town, Site){
        // Init
        $scope.placesBlocks = [
          { template: 'tpl/reefcheck/settings/places_countries.html', open: ($state.current.name.indexOf('places.countries') > 0) ? true : false },
          { template: 'tpl/reefcheck/settings/places_provinces.html', open: ($state.current.name.indexOf('places.provinces') > 0) ? true : false },
          { template: 'tpl/reefcheck/settings/places_towns.html', open: ($state.current.name.indexOf('places.towns') > 0) ? true : false },
          { template: 'tpl/reefcheck/settings/places_sites.html', open: ($state.current.name.indexOf('places.sites') > 0) ? true : false },
        ];
        
        // Countries Begin ----------------------------------------------- 
        $scope.loadingCountries = false;
        $scope.countries = []

        $scope.getCountries = function() {
          $scope.loadingCountries = true;
          Country.list()
          .then(function (data) {            
            $scope.loadingCountries = false;
            $scope.countries = data;
            
            $timeout(function(){
                // $('.table').trigger('footable_redraw');
            }, 100);
          }, function (error) {
            
          });
        }
        $scope.getCountries();
        // Countries End -------------------------------------------------

        // Provinces Begin ----------------------------------------------- 
        $scope.loadingProvinces = false;
        $scope.provinces = []

        $scope.getProvinces = function() {
          $scope.loadingProvinces = true;
          Province.list()
          .then(function (data) {            
            $scope.loadingProvinces = false;
            $scope.provinces = data;
            
            $timeout(function(){
                // $('.table').trigger('footable_redraw');
            }, 100);
          }, function (error) {
            
          });
        }
        $scope.getProvinces();
        // Provinces End -------------------------------------------------

        // Towns Begin ----------------------------------------------- 
        $scope.loadingTowns = false;
        $scope.towns = []

        $scope.getTowns = function() {
          $scope.loadingTowns = true;
          Town.list()
          .then(function (data) {            
            $scope.loadingTowns = false;
            $scope.towns = data;
            
            $timeout(function(){
                // $('.table').trigger('footable_redraw');
            }, 100);
          }, function (error) {
            
          });
        }
        $scope.getTowns();
        // Towns End -------------------------------------------------

        // Sites Begin ----------------------------------------------- 
        $scope.loadingSites = false;
        $scope.sites = []

        $scope.getSites = function() {
          $scope.loadingSites = true;
          Site.list()
          .then(function (data) {            
            $scope.loadingSites = false;
            $scope.sites = data;
            
            $timeout(function(){
                // $('.table').trigger('footable_redraw');
            }, 100);
          }, function (error) {
            
          });
        }
        $scope.getSites();
        // Towns End -------------------------------------------------
      }
    ]
  ).controller('ReefCheckSettingsGroupsCtrl', 
    ['$scope','reefCheckGroupSet', 
      function ($scope,reefCheckGroupSet){
        // Init

        // Group Set Begin ----------------------------------------------- 
        $scope.loadingGroupSet = false;
        $scope.errorGroupSet = {};
        $scope.group_set = []

        $scope.getGroupSet = function() {
          $scope.loadingGroupSet = true;
          reefCheckGroupSet.list()
          .then(function (data) {            
            $scope.loadingCountries = false;
            $scope.countries = data;
            
            $timeout(function(){
                // $('.table').trigger('footable_redraw');
            }, 100);
          }, function (error) {
            console.log('lala')
            console.log(error)
            $scope.loadingCountries = false;
            $scope.errorGroupSet = error;
          });
        }
        $scope.getGroupSet();
        // Countries End -------------------------------------------------
      }
    ]
  );