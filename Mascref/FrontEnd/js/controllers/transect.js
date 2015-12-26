'use strict';

/* Transect Controllers */

angular.module('app.controllers')
  .controller('TransectCtrl', ['$scope', '$translate', '$state', '$stateParams', '$filter', 'Sites', 'Transect', 'Group', 'Segment', 'uiGmapGoogleMapApi', 'uiGmapIsReady', 'MASCREF_CONF', function ($scope, $translate, $state, $stateParams, $filter, Sites, Transect, Group, Segment, uiGmapGoogleMapApi, uiGmapIsReady, MASCREF_CONF) {
    // Logged status
    if (!$scope.authenticated) {
      $state.go('access.signin');
    }

    // Init
    $scope.MASCREF_CONF = MASCREF_CONF;
    $scope.tabs = [
      { heading: "Debug", template: 'tpl/blocks/transect_debug.html' },
      { heading: "Site Info", template: 'tpl/blocks/transect_site_info.html' },
      { heading: "Line Transect", template: 'tpl/blocks/transect_line_form.html' },
      { heading: "Line Graphs", template: 'tpl/blocks/transect_line_graphs.html' },
      { heading: "Belt Transect", template: 'tpl/blocks/transect_belt_form.html' },
      { heading: "Belt Graphs", template: 'tpl/blocks/transect_belt_graphs.html' },
      { heading: "Team Information", template: 'tpl/blocks/transect_team_information.html' },
    ];
    $scope.transect = { 
      info: null,      
      conditions: {},
      team: {},
      belt: { data: [] },
      line: { data: [] }
    }

    for (var i = 0 ; i < MASCREF_CONF.TRANSECT_SEGMENTS_TOTAL ; ++i){
      $scope.transect.belt.data[i] = [];
      $scope.transect.line.data[i] = [];
    }

    $scope.line_groups = []
    $scope.belt_categories = {}
    $scope.belt_groups = {}
    $scope.response = {}
    $scope.map = {
      center: {
        latitude: MASCREF_CONF.COORD.LAT,
        longitude: MASCREF_CONF.COORD.LONG
        //latitude: -27.68,
        //longitude: -48.49
      },
      zoom: MASCREF_CONF.COORD.ZOOM,
      options: { scrollwheel: false, panControl: false, streetViewControl: false }
    };
    $scope.control = {}
    $scope.marker = {
      id: 0,
      coords: {
        latitude: MASCREF_CONF.COORD.LAT,
        longitude: MASCREF_CONF.COORD.LONG
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
        //if (data.project != $stateParams.projectId) {
         // $state.go('app.projects.view.survey', { projectId: $stateParams.surveyId })
        //}
        $scope.transect.info = data;        

        $scope.getDataLine($scope.transect.info.id);
        //$scope.getDataBelt($stateParams.transect.id);
        //$scope.getInfo($stateParams.transect.id);
        //$scope.getTeam($stateParams.transect.id);
        
        if ($scope.transect.info.site) Sites.get($scope.transect.info.site).then(function (data) { $scope.transect.info.site = data }, function (error) { });
      }, function (error) {
        //console.log(error)
        //$state.go('app.projects.view.survey', { projectId: $stateParams.surveyId });
      });
    }

    $scope.getSites = function (val) {
      return Sites.list(val)
      .then(function (data) {
        var sites = [];
        angular.forEach(data, function (item) {
          sites.push(item);
        });
        return sites;
      });
    };

    $scope.getCategories = function (parent, type) {
      Group.getCategories(parent, type)
      .then(function (data) {
        $scope.belt_categories = data;
        angular.forEach(data, function (v, k) {
          $scope.getGroups('belt_groups', 'null', type, v['id']);
        });
      }, function (error) {

      });
    }

    $scope.getGroups = function (model, parent, type, category) {
      Group.list(parent, type, category)
      .then(function (data) {
        if (category) $scope[model][category] = data;
        else $scope[model] = data;
      }, function (error) {

      });    
    }

    $scope.getDataLine = function (transect) {
      angular.forEach($scope.transect.line.data, function (v, k) {
        Segment.list(transect, MASCREF_CONF.TRANSECT_TYPE.LINE, k + 1)
        .then(function (data) {
          //$scope.line_transect[k] = data
          angular.forEach(data, function (dV, dK) {
            $scope.transect.line.data[k][dV.value-1] = dV;
          });
        }, function (error) {

        });
      });
    }

    $scope.sum = function (data,prop) {
      return $filter('sum')(data,prop);
    }

    // $scope.initLineTransect = function () {
    //   for (var i = 0 ; i < MASCREF_CONF.TRANSECT_SEGMENTS_TOTAL ; ++i) {
    //     $scope.line_transect[i] = [];
    //   }
    // }

    $scope.save = function () {
      // First I need to check if I have the site ID
      Transect.save($scope.transect.info)
      .then(function (data) {
        $scope.transect.info = data;
        if ($scope.transect.info.id) {
          angular.forEach($scope.transect.line.data, function (seg, k) {
            angular.forEach(seg, function (point, key) {
              if (!point.token) {
                var pad = ('00' + (key + 1)).slice(-2);
                point.token = $scope.transect.info.id + '_' + MASCREF_CONF.TRANSECT_TYPE.LINE + '_' + (k + 1) + '_' + pad;
                point.transect = $scope.transect.info.id;
                point.segment = k + 1;
                point.type = MASCREF_CONF.TRANSECT_TYPE.LINE;                
                point.value = key + 1;
                if (point.group_name) {
                  if (point.group_name.id) point.group = point.group_name.id;
                  else point.group = $filter('filter')($scope.line_groups, { name: point.group_name }, true)[0].id;
                }
              }             
              Segment.save(point).then(function (data) { $scope.transect.line.data[k][key] = data; }, function (error) { });
            });
          });
        }
      }, function (error) {
        $scope.response = error
      });
    }

    $scope.updateMarkers = function() {
      $scope.markers = [{
        id: $scope.transect.info.id ? $scope.transect.info.id : 1,
        coords: {
          latitude: $scope.transect.info.site.lat,
          longitude: $scope.transect.info.site.long
        },
        options: {
          draggable: true,
          show: true,
          title: $scope.transect.info.site.name
        }
      }];

      $scope.bounds = new google.maps.LatLngBounds();
      angular.forEach($scope.markers, function (value, key) {
          var myLatLng = new google.maps.LatLng($scope.markers[key].coords.latitude, $scope.markers[key].coords.longitude);
          $scope.bounds.extend(myLatLng);
      });
      $scope.map = { center: { latitude: $scope.bounds.getCenter().lat(), longitude: $scope.bounds.getCenter().lng() } };
      $scope.map.options = { MapTypeId: google.maps.MapTypeId.SATELLITE };

      $scope.control.getGMap().fitBounds($scope.bounds);
    }

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function (maps) {
      $('.angular-google-map-container').css('height', '300px');
    });

    uiGmapIsReady.promise().then((function (maps) {
      $scope.$watch('transect.info.site.lat', function (newVal, oldVal) {
        if ($scope.transect.info.site && $scope.transect.info.site.lat && $scope.transect.info.site.long) {
          $scope.updateMarkers();
        }
      });
    }));
        
    // Run
    if ($stateParams.transectId) $scope.getTransect($stateParams.transectId);
    $scope.getCategories(null, MASCREF_CONF.TRANSECT_TYPE.BELT);
    $scope.getGroups('line_groups', 'null', MASCREF_CONF.TRANSECT_TYPE.LINE);    
  }]);