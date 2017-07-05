'use strict';

/* Transect Controllers */

angular.module('app.controllers')
  .controller('TransectCtrl', 
    [
      '$scope', 
      '$rootScope', 
      '$translate',
      '$state', 
      '$stateParams', 
      '$filter', 
      'Site', 
      'Transect', 
      'Country', 
      'Province',
      'Town',
      'Group',
      'uiGmapGoogleMapApi', 
      'uiGmapIsReady', 
      'coordinateFilterFilter', 
      'MASCREF_CONF', 
      function (
          $scope, 
          $rootScope, 
          $translate, 
          $state, 
          $stateParams, 
          $filter, 
          Site, 
          Transect,  
          Country, 
          Province, 
          Town,
          Group,
          uiGmapGoogleMapApi, 
          uiGmapIsReady, 
          coordinateFilterFilter, 
          MASCREF_CONF
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
      reefcheck: {
        segments_total: $scope.MASCREF_CONF.TRANSECT_SEGMENTS_TOTAL,
        segments_points: $scope.MASCREF_CONF.TRANSECT_SEGMENTS_POINTS,
        segments_length: $scope.MASCREF_CONF.TRANSECT_SEGMENTS_LENGTH,
        segments_space: $scope.MASCREF_CONF.TRANSECT_SEGMENTS_SPACE,
        transect_line_id: $scope.MASCREF_CONF.TRANSECT_TYPE.LINE,
        transect_belt_id: $scope.MASCREF_CONF.TRANSECT_TYPE.BELT,
        group_set_line: $scope.MASCREF_CONF.REEFCHECK_GROUP_SET_LINE,
        group_set_belt: $scope.MASCREF_CONF.REEFCHECK_GROUP_SET_BELT
      }
    }


    if(angular.isDefined($rootScope.config)) {
      $scope.config = $rootScope.config;
    }

    $scope.transect = { 
      info: { site: null, survey: $stateParams.surveyId, coords: { dd: {}, dms: { lat: {}, long: {} } } },      
      // basic: {},
      // team: {},
      belt: { data: [] },
      line: { data: [] }
    }

    // --- Begin Configs for line and belt transect
    $scope.line_groups = []
    $scope.line_graphs = {}
    $scope.line_graphs_data = null;  

    for (var i = 0 ; i < $scope.config.reefcheck.segments_total ; ++i){
      // $scope.transect.belt.data[i] = [];
      $scope.transect.line.data[i] = [];
    }
    // --- End Configs for line and belt transect
    
    $scope.tabs = [
      // { heading: "Debug", template: 'tpl/blocks/transect_debug.html' },
      { heading: "Site Info", controller: "TransectSiteFormCtrl", template: 'tpl/blocks/transect_site_info.html', disabled: ($scope.transect.info.id ? true : false) },
      { heading: "Line Transect", controller: "TransectLineFormCtrl", template: 'tpl/blocks/transect_line_form.html', disabled: ($scope.transect.info.id ? true : false) },
      { heading: "Line Graphs", controller: "TransectLineGraphCtrl", template: 'tpl/blocks/transect_line_graphs.html', disabled: ($scope.transect.info.id ? true : false) },
      { heading: "Belt Transect", controller: "TransectLineBeltFormCtrl", template: 'tpl/blocks/transect_belt_form.html', disabled: ($scope.transect.info.id ? true : false) },
      { heading: "Belt Graphs", controller: "TransectBeltGraphCtrl", template: 'tpl/blocks/transect_belt_graphs.html', disabled: ($scope.transect.info.id ? true : false) },
      // { heading: "Team Information", template: 'tpl/blocks/transect_team_information.html' },
    ];

    // $scope.setTabContent = function(name) {
    //   $scope.tabContentUrl = "tpl/blocks/transect_" + name + "html";
    // }

    $scope.response = {}
    $scope.markers = []
    $scope.markersSurvey = []

    $scope.map = {
      center: {
        latitude: $scope.config.map.lat,
        longitude: $scope.config.map.long
      },
      zoom: $scope.config.map.zoom,
      options: { scrollwheel: false, panControl: false, streetViewControl: false, mapTypeId: 'satellite' }
    };
    $scope.control = {}
    $scope.marker = {
      id: 0,
      coords: {
        latitude: $scope.config.map.lat,
        longitude: $scope.config.map.long
      },
      options: {
        draggable: true,
        visible: false
      }
    }

    //******** Begin Functions ********//
    // Retrieve info about the project
    $scope.getTransect = function (pk) {
      Transect.get(pk)
      .then(function (data) {
        // Check if parent project on the view is the same as the parent on the retrieved survey
        if (data.survey != $stateParams.surveyId) {
         $state.go('app.projects.view.survey', { surveyId: $stateParams.surveyId })
        }
        $scope.transect.info = data;

        if($scope.transect.info.time_start) {
          var mTime = $scope.transect.info.time_start.split(':');
          $scope.transect.info.time_start = new Date(1970, 0, 1, mTime[0], mTime[1], mTime[2]);
        }

        if($scope.transect.info.time_end) {
          var mTime = $scope.transect.info.time_end.split(':');
          $scope.transect.info.time_end = new Date(1970, 0, 1, mTime[0], mTime[1], mTime[2]);
        }

        if ($scope.transect.info.site) Site.get($scope.transect.info.site).then(function (data) { $scope.transect.info.site = data }, function (error) { });
      }, function (error) {
        //console.log(error)
        //$state.go('app.projects.view.survey', { projectId: $stateParams.surveyId });
      });
    }

    $scope.getCountries = function (val) {
      return Country.list(val)
      .then(function (data) {
        var countries = [];
        angular.forEach(data, function (item) {
          countries.push(item);
        });
        return countries;
      });
    };

    $scope.getProvinces = function (val, country) {
      return Province.list(val, country)
      .then(function (data) {
        var provinces = [];
        angular.forEach(data, function (item) {
          provinces.push(item);
        });
        return provinces;
      });
    };

    $scope.getTowns = function (val, country, province) {
      return Town.list(val, country, province)
      .then(function (data) {
        var towns = [];
        angular.forEach(data, function (item) {
          towns.push(item);
        });
        return towns;
      });
    };

    $scope.getSites = function (val) {
      return Site.list(val)
      .then(function (data) {
        var sites = [];
        angular.forEach(data, function (item) {
          sites.push(item);
        });
        return sites;
      });
    };

    $scope.save = function () {
      //if($scope.validateForm()) return false;
      $scope.response = {}
      // 0 - Check if site has id, otherwise create everything
      // if($scope.transect.info.site && !$scope.transect.info.site.id) {
      if($scope.transect.info.site == null) {
        
        $scope.response = { type: 'danger', msg: 'Site is required' }
        return false;
      }
      if($scope.transect.info.site && !$scope.transect.info.site.id) {
        // 1 - Check if country has id, otherwise create
        if($scope.transect.info.country && !$scope.transect.info.country.id) {
          $scope.saveCountry();
          return false;
        }
        // 2 - Check if province is not null and has an id, otherwise create
        else if($scope.transect.info.province && !$scope.transect.info.province.id) {
          $scope.saveProvince();
          return false;
        }
        // 3 - Check if town has id, otherwise create
        else if($scope.transect.info.town && !$scope.transect.info.town.id) {
          $scope.saveTown();
          return false;
        }
        // 4 - Finally create the site
        else {
          if(!$scope.transect.info.country.id) {
            // Select Country
            $scope.response = { type: 'error', msg: 'Country is required' }
            return false;
          }
          else if(!$scope.transect.info.town.id) {
            // Select Town / Island
            $scope.response = { type: 'error', msg: 'Town / Island is required' }
            return false;
          }
          else if(!$scope.transect.info.coords.dd.lat) {
            // Select Latitude
            $scope.response = { type: 'error', msg: 'Latitude is required' }
            return false;
          }
          else if(!$scope.transect.info.coords.dd.long) {
            // Select Latitude
            $scope.response = { type: 'error', msg: 'Longitude is required' }
            return false;
          }
          else if(!$scope.transect.info.name) {
            $scope.response = { type: 'error', msg: 'Transect name is required' }
            return false;
          }
          else {
            $scope.saveSite();
          }
        }
      }
      $scope.response = {
        type: 'info',
        msg: 'Saving transect basic information...'
      }
      // 5 - Save Transect
      Transect.save($scope.transect.info)
      .then(function (data) {
        // change url path
        $scope.response.type = "success"
        $scope.response.msg = "Transect saved successfully" 

        $state.go("admin.projects.view.survey.transect",
          { 
            "projectId": $stateParams.projectId,
            "surveyId": $stateParams.surveyId,
            "transectId": data.id
          }
        );
      }, function (error) {
        $scope.response = error
      });
    }

    $scope.saveCountry = function () {
      Country.save($scope.transect.info.country)
      .then(function (data) {
        $scope.transect.info.country = data;
        $scope.save();
      });
    }

    $scope.saveProvince = function () {
      Province.save({ 'name': $scope.transect.info.province, 'country': $scope.transect.info.country.id })
      .then(function (data) {
        $scope.transect.info.province = data;
        $scope.save();
      });
    }

    $scope.saveTown = function () {
      Town.save({ 'name': $scope.transect.info.town, 'country': $scope.transect.info.country.id, 'province': $scope.transect.info.province.id })
      .then(function (data) {
        $scope.transect.info.town = data;
        $scope.save();
      });
    }

    $scope.saveSite = function () {
      Site.save({ 'name': $scope.transect.info.site, 'lat': $scope.transect.info.coords.dd.lat, 'long': $scope.transect.info.coords.dd.long, 'town': $scope.transect.info.town.id })
      .then(function (data) {
        $scope.transect.info.site = data;
        $scope.save();
      });
    }

    $scope.updateMap = function() {
      if($scope.transect.info.id || !$scope.transect.info.coords) return 0;
      $scope.markers = [{
        id: 0,
        coords: {
          latitude: parseFloat(coordinateFilterFilter($scope.transect.info.coords.dd.lat, 'toDD')) || MASCREF_CONF.COORD.LAT,
          longitude: parseFloat(coordinateFilterFilter($scope.transect.info.coords.dd.long, 'toDD')) || MASCREF_CONF.COORD.LONG
        },
        options: { draggable: true, show: true, title: ($scope.transect.info.site ? $scope.transect.info.site.name : '') },
        events: {
          dragend: function (marker, eventName, args) {
            $scope.transect.info.coords.dd.lat = $filter('number')(marker.getPosition().lat(),6);
            $scope.transect.info.coords.dd.long = $filter('number')(marker.getPosition().lng(),6);
          }
        }
      }];

      $scope.map.center = {
        latitude: parseFloat(coordinateFilterFilter($scope.transect.info.coords.dd.lat, 'toDD')) || MASCREF_CONF.COORD.LAT,
        longitude: parseFloat(coordinateFilterFilter($scope.transect.info.coords.dd.long, 'toDD')) || MASCREF_CONF.COORD.LONG
      }
    }

    $scope.initMarkers = function() {
      
      $scope.markers = [{
        id: $scope.transect.info.site.id,
        coords: {
          latitude: $scope.transect.info.site.lat,
          longitude: $scope.transect.info.site.long 
        },
        options: {
          draggable: false,
          show: true,
          title: $scope.transect.info.site.name
        }
      }];

      $scope.transect.info.coords = {
        dd: {
          lat: $scope.transect.info.site.lat,
          long: $scope.transect.info.site.long,
        }  
      }

      $scope.bounds = new google.maps.LatLngBounds();
      angular.forEach($scope.markers, function (value, key) {
        var myLatLng = new google.maps.LatLng($scope.markers[key].coords.latitude, $scope.markers[key].coords.longitude);
        $scope.bounds.extend(myLatLng);
      });
      $scope.map = { center: { latitude: $scope.bounds.getCenter().lat(), longitude: $scope.bounds.getCenter().lng() } };
      $scope.map.options = { MapTypeId: google.maps.MapTypeId.SATELLITE };

      $scope.control.getGMap().fitBounds($scope.bounds);
      $scope.control.getGMap().setZoom($scope.control.getGMap().getZoom()-5)
    }

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function (maps) {
      $('.angular-google-map-container').css('height', '500px');
    });


    uiGmapIsReady.promise(2).then(function (maps) {
      $scope.map.options = { MapTypeId: google.maps.MapTypeId.SATELLITE };
      $scope.$watch('transect.info.site.lat', function (newVal, oldVal) {
        if ($scope.transect.info.site && $scope.transect.info.site.lat && $scope.transect.info.site.long) {
          $scope.initMarkers();
        }
      });
    });
        
    // Run  
    if ($stateParams.transectId) $scope.getTransect($stateParams.transectId);
  }]);