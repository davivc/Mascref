'use strict';

/* Transect Controllers */

angular.module('app.controllers')
  .controller('MapsCtrl', 
    [
      '$scope', 
      '$rootScope', 
      '$translate',
      '$state', 
      '$stateParams', 
      'uiGmapGoogleMapApi', 
      'uiGmapIsReady', 
      'MASCREF_CONF',
      'Surveys',
      'Data',
      function (
          $scope, 
          $rootScope, 
          $translate, 
          $state, 
          $stateParams, 
          uiGmapGoogleMapApi, 
          uiGmapIsReady, 
          MASCREF_CONF,
          Surveys,
          Data
      ) {
    // Logged status
    if (!$scope.authenticated) {
      $state.go('access.signin');
    }

    // Init

    // Get Configs
    $scope.MASCREF_CONF = MASCREF_CONF;
    $scope.config = { 
      map: {
        lat: $scope.MASCREF_CONF.COORD.LAT,
        long: $scope.MASCREF_CONF.COORD.LONG,
        zoom: $scope.MASCREF_CONF.COORD.ZOOM
      },
      marker: {
        id: 0,
        coords: {
          latitude: $scope.MASCREF_CONF.COORD.LAT,
          longitude: $scope.MASCREF_CONF.COORD.LONG
        },
        options: {
          draggable: false,
          visible: false
        }
      },
    }


    if(angular.isDefined($rootScope.config)) {
      $scope.config = $rootScope.config;
    }

    $scope.filterProjects = [];
    $scope.filterSurveys = [];
    $scope.filterYears = [];
    $scope.filterCountries = [];
    $scope.filterSites = [];
        

    $scope.surveys = []
    $scope.markers = []
    $scope.activeMarker = undefined;

    $scope.map = {
      center: {
        latitude: $scope.config.map.lat,
        longitude: $scope.config.map.long
      },
      zoom: $scope.config.map.zoom,
      options: { scrollwheel: false, panControl: false, streetViewControl: false, mapTypeId: 'satellite' }
    };
    $scope.control = {}
    // $scope.marker = {
    //   id: 0,
    //   coords: {
    //     latitude: $scope.config.map.lat,
    //     longitude: $scope.config.map.long
    //   },
    //   options: {
    //     draggable: true,
    //     visible: false
    //   }
    // }


    $scope.getFilterProjects = function() {
      Data.getSubstrate('json','project')
      .then(function (data) {
        $scope.filterProjects = data;
      }, function (error) {
        
      });
    }

    $scope.getFilterSurveys = function() {
      Data.getSubstrate('json','survey')
      .then(function (data) {
        $scope.filterSurveys = data;
      }, function (error) {
        
      });
    }

    $scope.getFilterYears = function() {
      Data.getSubstrate('json','year')
      .then(function (data) {
        $scope.filterYears = data;
      }, function (error) {
        
      });
    }

    $scope.getFilterCountries = function() {
      Data.getSubstrate('json','country')
      .then(function (data) {
        $scope.countries = data;
      }, function (error) {
        
      });
    }

    $scope.getFilterSites = function() {
      Data.getSubstrate('json','site')
      .then(function (data) {
        $scope.filterSites = data;
      }, function (error) {
        
      });
    }

    $scope.initMarkers = function() {
      
      $scope.markers = []
      angular.forEach($scope.surveys, function (survey) {
        angular.forEach(survey.sites, function (site) {
          var marker = {
            id: site.id,
            //coords: {
            latitude: site.lat,
            longitude: site.long,
            //},
            options: {
              draggable: false,
              show: true,
              title: site.name
            }
            //show: false
          }
          // marker.click = function() {
          //   marker.show = !marker.show;
          //   marker.content = 'issaaaaaaaaaaaaaa';
          // };

          $scope.markers.push(marker)
        });  
      });

      $scope.bounds = new google.maps.LatLngBounds();
      angular.forEach($scope.markers, function (value, key) {
        // var myLatLng = new google.maps.LatLng($scope.markers[key].coords.latitude, $scope.markers[key].coords.longitude);
        var myLatLng = new google.maps.LatLng($scope.markers[key].latitude, $scope.markers[key].longitude);
        $scope.bounds.extend(myLatLng);
      });
      $scope.map = { center: { latitude: $scope.bounds.getCenter().lat(), longitude: $scope.bounds.getCenter().lng() } };
      $scope.map.options = { MapTypeId: google.maps.MapTypeId.SATELLITE };
      $scope.map.window = {
        marker: {},
        show: false,
        closeClick: function() {
          this.show = false;
        },
        options: {
          pixelOffset : {
              height: -25,
              width: 0
          }
        } 
      };
      $scope.map.markersEvents = {
        click: function(marker, eventName, model) {
          //console.log(model)
          //$scope.map.window.model = model;
          //$scope.map.window.show = true;
        }
      };
      


      $scope.control.getGMap().fitBounds($scope.bounds);
      var zoom = $scope.control.getGMap().getZoom()
      if(zoom > 15) zoom = zoom -5
      $scope.control.getGMap().setZoom(zoom)
    }

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function (maps) {
      $('.angular-google-map-container').css('height', '94vh');
      $('.app-content-body').css('padding-bottom', '0px');
    });


    uiGmapIsReady.promise(1).then(function (maps) {
      $scope.map.options = { MapTypeId: google.maps.MapTypeId.SATELLITE };
      $scope.getSurveys();
    });

    $scope.getSurveysFiltered = function(idSite) {

    }

    // Retrieve the list of Surveys children of this project
    $scope.getSurveys = function () {
      Surveys.list()
      .then(function (data) {
        $scope.surveys = data;
        $scope.initMarkers();
      }, function (error) {
        console.error('Surveys list: ' + error);
        //$scope.stats.error = error;
      });
    }

    $scope.getFilterProjects();
    $scope.getFilterSurveys();
    $scope.getFilterYears();
    $scope.getFilterCountries();
    $scope.getFilterSites();
  }]);