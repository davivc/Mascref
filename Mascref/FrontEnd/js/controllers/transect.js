'use strict';

/* Transect Controllers */

angular.module('app.controllers')
  .controller('TransectCtrl', 
    [
      '$scope', 
      '$translate', 
      '$state', 
      '$stateParams', 
      '$filter', 
      'Site', 
      'Transect', 
      'Group', 
      'Segment', 
      'Country', 
      'Province',
      'Town',
      'uiGmapGoogleMapApi', 
      'uiGmapIsReady', 
      'coordinateFilterFilter', 
      'MASCREF_CONF', 
      function (
          $scope, 
          $translate, 
          $state, 
          $stateParams, 
          $filter, 
          Site, 
          Transect, 
          Group, 
          Segment, 
          Country, 
          Province, 
          Town,
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
      info: { survey: $stateParams.surveyId },      
      basic: {},
      team: {},
      belt: { data: [] },
      line: { data: [] }
    }

    $scope.line_graphs = {};
    $scope.$watch('transect.line.data',function(oldVal,newVal) { $scope.updateLineGraphs(); }, true)

    for (var i = 0 ; i < MASCREF_CONF.TRANSECT_SEGMENTS_TOTAL ; ++i){
      // $scope.transect.belt.data[i] = [];
      $scope.transect.line.data[i] = [];
    }

    $scope.line_groups = []
    $scope.markers = []
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
        $scope.getDataBelt($scope.transect.info.id);
        $scope.getInfo($scope.transect.info.id);
        //$scope.getTeam($stateParams.transect.id);
        
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

    $scope.getDataBelt = function (transect) {
      for (var i = 0 ; i < MASCREF_CONF.TRANSECT_SEGMENTS_TOTAL ; ++i){
        Segment.list(transect, MASCREF_CONF.TRANSECT_TYPE.BELT, i + 1)
        .then(function (data) {
          //$scope.line_transect[k] = data
          // console.log(data)
          angular.forEach(data, function (dV, dK) {
            if(!$scope.transect.belt.data[dV['group']]) $scope.transect.belt.data[dV['group']] = [];
            $scope.transect.belt.data[dV['group']][i] = dV.value;
            if(dV['parent']) {
              if(!$scope.transect.belt.data[dV['parent']]) $scope.transect.belt.data[dV['parent']] = { 'sub_groups': [] };
              if(!$scope.transect.belt.data[dV['parent']]['sub_groups'][dV['group']]) $scope.transect.belt.data[dV['parent']]['sub_groups'][dV['group']] = [];
              $scope.transect.belt.data[dV['parent']]['sub_groups'][dV['group']][i] = dV.value;
            }
          });
          // console.log($scope.transect.belt.data)
        }, function (error) {

        });
        break;
      }
    }

    $scope.getInfo = function (pId) {
      Transect.getInfo(pId)
      .then(function (data) {
        angular.forEach(data, function (v, k) {
          $scope.transect.basic[v['name']] = v['value'];
        });
      }, function (error) {

      });    
    }

    $scope.updateLineGraphs = function() {
      angular.forEach($scope.line_groups, function (groups_val, groups_key) {
        $scope.line_graphs[groups_val.name] = { 'segs': [], 'sum': 0, 'mean': 0, 'sd': 0, 'se': 0, 'percent_segs': [], 'percent_sum': 0, 'percent_mean': 0, 'percent_sd': 0, 'percent_se': 0 }
        for (var i = 0 ; i < MASCREF_CONF.TRANSECT_SEGMENTS_TOTAL ; ++i){
          $scope.line_graphs[groups_val.name]['segs'][i] = $filter('filter')($scope.transect.line.data[i],groups_val.name).length;
          $scope.line_graphs[groups_val.name]['percent_segs'][i] = $scope.line_graphs[groups_val.name]['segs'][i]/MASCREF_CONF.TRANSECT_SEGMENTS_POINTS*100;
        }
        $scope.line_graphs[groups_val.name].sum = $filter('sum')($scope.line_graphs[groups_val.name]['segs']);
        $scope.line_graphs[groups_val.name].mean = $filter('mean')($scope.line_graphs[groups_val.name]['segs']);
        $scope.line_graphs[groups_val.name].sd = $filter('sd')($scope.line_graphs[groups_val.name]['segs']);
        $scope.line_graphs[groups_val.name].se = $scope.line_graphs[groups_val.name].sd/Math.sqrt(MASCREF_CONF.TRANSECT_SEGMENTS_TOTAL);

        $scope.line_graphs[groups_val.name].percent_sum = $filter('sum')($scope.line_graphs[groups_val.name]['percent_segs']);
        $scope.line_graphs[groups_val.name].percent_mean = $filter('mean')($scope.line_graphs[groups_val.name]['percent_segs']);
        $scope.line_graphs[groups_val.name].percent_sd = $filter('sd')($scope.line_graphs[groups_val.name]['percent_segs']);
        $scope.line_graphs[groups_val.name].percent_se = $scope.line_graphs[groups_val.name].percent_sd/Math.sqrt(MASCREF_CONF.TRANSECT_SEGMENTS_TOTAL);
        // $scope.line_graphs.push(group_data);
      });
      // $scope.$apply();
      console.log($scope.line_graphs);
    }

    $scope.sum = function (data,prop) {
      return $filter('sum')(data,prop);
    }

    $scope.save = function () {
      //if($scope.validateForm()) return false;

      // 0 - Check if site has id, otherwise create everything
      if($scope.transect.info.site && !$scope.transect.info.site.id) {
        // 1 - Check if country has id, otherwise create
        if($scope.transect.info.country && !$scope.transect.info.country.id) $scope.saveCountry();
        // 2 - Check if province is not null and has an id, otherwise create
        else if($scope.transect.info.province && !$scope.transect.info.province.id) $scope.saveProvince();
        // 3 - Check if town has id, otherwise create
        else if($scope.transect.info.town && !$scope.transect.info.town.id) $scope.saveTown();
        // 4 - Finally create the site
        else $scope.saveSite();
      }
      // 5 - Save Transect
      Transect.save($scope.transect.info)
      .then(function (data) {
        // $scope.transect.info = data;
        $scope.saveLine();
        $scope.saveBelt();
        $scope.saveInfo();
        $scope.saveTeam();
        // change url path
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

    $scope.saveLine = function() {
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

    $scope.saveBelt = function() {
      
    }

    $scope.saveInfo = function() {
      angular.forEach($scope.transect.basic, function (v, k) {
        Transect.getInfo($scope.transect.info.id,k).then(function (data) { 
          Transect.saveInfo({ 
            'id': data[0].id ? data[0].id : null,
            'transect': $scope.transect.info.id,
            'name': k,
            'value': v,
          }).then(function (data) {  }, function (error) { });
        }, function (error) { });
      });
    }

    $scope.saveTeam = function() {
      
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

      // console.log($scope.map.center)
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
        'dd': {
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
      $scope.control.getGMap().setZoom($scope.control.getGMap().getZoom()-2)
    }

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function (maps) {
      $('.angular-google-map-container').css('height', '300px');
    });

    uiGmapIsReady.promise().then((function (maps) {
      $scope.map.options = { MapTypeId: google.maps.MapTypeId.SATELLITE };
      $scope.$watch('transect.info.site.lat', function (newVal, oldVal) {
        if ($scope.transect.info.site && $scope.transect.info.site.lat && $scope.transect.info.site.long) {
          $scope.initMarkers();
        }
      });
      //$scope.$watch('transect.info.coords.dd.lat', $scope.updateMap);
      //$scope.$watch('transect.info.coords.dd.long', $scope.updateMap);
    }));

    // $scope.initBeltForm = function() {
    //   angular.forEach($scope.transect.belt.data, function (v, seg) {
    //     angular.forEach($scope.belt_groups, function (val, key) {
    //       console.log(val)
    //       //if(dV['parent']) $scope.transect.belt.data[dV['parent']]['sub_groups'][dV['group']][seg] = dV.value;
    //       //else $scope.transect.belt.data[dV['group']][seg] = dV.value;
    //     });
    //   });
    // }
        
    // Run
    $scope.getCategories(null, MASCREF_CONF.TRANSECT_TYPE.BELT);
    $scope.getGroups('line_groups', 'null', MASCREF_CONF.TRANSECT_TYPE.LINE);    
    if ($stateParams.transectId) $scope.getTransect($stateParams.transectId);
  }]);