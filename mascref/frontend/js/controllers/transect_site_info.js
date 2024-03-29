﻿'use strict';

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
          $rootScope, 
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

    // Get Configs
    $scope.MASCREF_CONF = MASCREF_CONF;
    $scope.config = { reefcheck: {} }

    if(angular.isDefined($rootScope.config)) {
      $scope.config = $rootScope.config;
    }
    else {
      $scope.config['reefcheck']['group_set'] = $scope.MASCREF_CONF.REEFCHECK_GROUP_SET_DEFAULT;
    }

    $scope.segments_total = $scope.MASCREF_CONF.TRANSECT_SEGMENTS_TOTAL;
    $scope.segments_points = $scope.MASCREF_CONF.TRANSECT_SEGMENTS_POINTS;
    $scope.segments_space = $scope.MASCREF_CONF.TRANSECT_SEGMENTS_SPACE;
    $scope.segments_length = $scope.MASCREF_CONF.TRANSECT_SEGMENTS_LENGTH;
    $scope.segments_intersect = $scope.segment_length/$scope.segments_points;

    $scope.config_line = $scope.MASCREF_CONF.REEFCHECK_LINE;   
    $scope.config_belt = $scope.MASCREF_CONF.REEFCHECK_BELT;    

    $scope.tabs = [
      // { heading: "Debug", template: 'tpl/blocks/transect_debug.html' },
      { heading: "Site Info", template: 'tpl/blocks/transect_site_info.html', disabled: true },
      { heading: "Line Transect", template: 'tpl/blocks/transect_line_form.html', disabled: true },
      { heading: "Line Graphs", template: 'tpl/blocks/transect_line_graphs.html', disabled: true },
      { heading: "Belt Transect", template: 'tpl/blocks/transect_belt_form.html', disabled: true },
      { heading: "Belt Graphs", template: 'tpl/blocks/transect_belt_graphs.html', disabled: true },
      // { heading: "Team Information", template: 'tpl/blocks/transect_team_information.html' },
    ];

    // if($scope.config_line) {
    //   $scope.tabs.push({ heading: "Line Transect", template: 'tpl/blocks/transect_line_form.html' });
    //   $scope.tabs.push({ heading: "Line Graphs", template: 'tpl/blocks/transect_line_graphs.html' });
    // }

    $scope.transect = { 
      info: { survey: $stateParams.surveyId, coords: { dd: {}, dms: { lat: {}, long: {} } } },      
      basic: {},
      team: {},
      belt: { data: [] },
      line: { data: [] }
    }
    
    $scope.belt_graphs = {};
    $scope.belt_graphs_data = {};

    $scope.line_graphs = {};
    $scope.line_graphs_data = null;    
    $scope.line_graphs_layout = {height: 600, width: 1000, title: 'Mean Percent of Substrate Cover with SE bars'};
    $scope.plot_options = { showLink: true, displayLogo: false };
    $scope.$watch('line_groups',function(oldVal,newVal) {
      $scope.line_graphs_data = [{
        x: [0],
        y: [0],
        error_y: {
          type: 'data',
          array: [0],
          visible: true
        },
        type: 'bar'
      }];
      $scope.updateLineGraphs();
    }, true);
    $scope.$watch('belt_groups',function(oldVal,newVal) { $scope.initBeltGraphs(); }, true);
    $scope.$watch('transect.line.data',function(oldVal,newVal) { $scope.updateLineGraphs(); }, true);
    $scope.$watch('transect.belt.data',function(oldVal,newVal) { $scope.updateBeltGraphs(); }, true)
    $scope.$watch('belt_graphs',function(newVal,oldVal) { $scope.updateBeltGraphsData(); }, true)

    for (var i = 0 ; i < $scope.segments_total ; ++i){
      // $scope.transect.belt.data[i] = [];
      $scope.transect.line.data[i] = [];
    }

    $scope.line_groups = []
    $scope.belt_categories = {}
    $scope.belt_groups = {}
    $scope.response = {}
    $scope.markers = []
    $scope.markersSurvey = []

    $scope.map = {
      center: {
        latitude: MASCREF_CONF.COORD.LAT,
        longitude: MASCREF_CONF.COORD.LONG
        //latitude: -27.68,
        //longitude: -48.49
      },
      zoom: MASCREF_CONF.COORD.ZOOM,
      options: { scrollwheel: false, panControl: false, streetViewControl: false, mapTypeId: 'satellite' }
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

    $scope.getBeltCategories = function () {
      Group.getCategories(MASCREF_CONF.TRANSECT_TYPE.BELT, $scope.config.reefcheck.group_set)
      .then(function (data) {
        $scope.belt_categories = data;
        angular.forEach(data, function (v, k) {
          $scope.getGroups('belt_groups', 'null', MASCREF_CONF.TRANSECT_TYPE.BELT, v['id']);
        });
      }, function (error) {

      });
    }

    $scope.getGroups = function (model, parent, type, category) {
      Group.list(parent, type, category, $scope.config.reefcheck.group_set)
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
          angular.forEach(data, function (dV, dK) {
            if(dV['parent']) {
              if(!$scope.transect.belt.data[dV['parent']]) $scope.transect.belt.data[dV['parent']] = { 'sub_groups': [] };
              if(!$scope.transect.belt.data[dV['parent']]['sub_groups'][dV['group']]) $scope.transect.belt.data[dV['parent']]['sub_groups'][dV['group']] = [];
              $scope.transect.belt.data[dV['parent']]['sub_groups'][dV['group']][i] = dV.value ? dV.value : 0;
              if(!isFinite($scope.transect.belt.data[dV['parent']][i])) $scope.transect.belt.data[dV['parent']][i] = 0;
              $scope.transect.belt.data[dV['parent']][i] += $scope.transect.belt.data[dV['parent']]['sub_groups'][dV['group']][i];
              // else 
            }
            else {
              if(!$scope.transect.belt.data[dV['group']]) $scope.transect.belt.data[dV['group']] = [];
              $scope.transect.belt.data[dV['group']][i] = dV.value ? dV.value : 0;              
            }
          });
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
      var x = [];
      var y = [];
      var error_y = [];
      angular.forEach($scope.line_groups, function (groups_val, groups_key) {
        $scope.line_graphs[groups_val.name] = { 'segs': [], 'sum': 0, 'mean': 0, 'sd': 0, 'se': 0, 'percent_segs': [], 'percent_sum': 0, 'percent_mean': 0, 'percent_sd': 0, 'percent_se': 0 }
        for (var i = 0 ; i < $scope.segments_total ; ++i){
          $scope.line_graphs[groups_val.name]['segs'][i] = $filter('filter')($scope.transect.line.data[i],groups_val.name).length;
          $scope.line_graphs[groups_val.name]['percent_segs'][i] = $scope.line_graphs[groups_val.name]['segs'][i]/$scope.segments_points*100;
        }
        $scope.line_graphs[groups_val.name].sum = $filter('sum')($scope.line_graphs[groups_val.name]['segs']);
        $scope.line_graphs[groups_val.name].mean = $filter('mean')($scope.line_graphs[groups_val.name]['segs']);
        $scope.line_graphs[groups_val.name].sd = $filter('sd')($scope.line_graphs[groups_val.name]['segs']);
        $scope.line_graphs[groups_val.name].se = $scope.line_graphs[groups_val.name].sd/Math.sqrt($scope.segments_total);

        $scope.line_graphs[groups_val.name].percent_sum = $filter('sum')($scope.line_graphs[groups_val.name]['percent_segs']);
        $scope.line_graphs[groups_val.name].percent_mean = $filter('mean')($scope.line_graphs[groups_val.name]['percent_segs']);
        $scope.line_graphs[groups_val.name].percent_sd = $filter('sd')($scope.line_graphs[groups_val.name]['percent_segs']);
        $scope.line_graphs[groups_val.name].percent_se = $scope.line_graphs[groups_val.name].percent_sd/Math.sqrt($scope.segments_total);
        // $scope.line_graphs.push(group_data);
        x.push(groups_val.name);
        y.push($scope.line_graphs[groups_val.name].percent_mean);
        error_y.push($scope.line_graphs[groups_val.name].percent_se);
      });
      $scope.line_graphs_data[0].x = x;
      $scope.line_graphs_data[0].y = y;
      $scope.line_graphs_data[0].error_y.array = error_y;
      // $scope.$apply();
      // console.log($scope.line_graphs_data);
    }

    $scope.initBeltGraphs = function() {      
      angular.forEach($scope.belt_categories, function (category) {
        var x = [];
        var y = [];
        var error_y = [];
        $scope.belt_graphs[category.id] = []
        angular.forEach($scope.belt_groups[category.id], function (item) {
          $scope.belt_graphs[category.id][item.id] = { id: item.id, sum: 0, mean: 0, sd: 0, se: 0 };
          if(item.sub_groups.length > 0) {
            $scope.belt_graphs[category.id][item.id].sub_groups = []
            angular.forEach(item.sub_groups, function (sub) {
              $scope.belt_graphs[category.id][item.id].sub_groups[sub.id] = { id: sub.id, sum: 0, mean: 0, sd: 0, se: 0 };
            });
          }
          x.push(item.name);
          y.push(0);
          error_y.push(0);
        });
        $scope.belt_graphs_data[category.id] = {
          'data': [{ 'x': x, 'y': y, 'error_y': { type: 'data', array: error_y, visible: true }, 'type': 'bar'}],
          'layout': { title: 'Mean Abundance of ' + category.name + ' with SE bars', width: 1000 },
          'options': { showLink: true, displayLogo: false },
        }
      });
      // console.log($scope.belt_graphs)
    }

    $scope.updateBeltGraphs = function() {
      angular.forEach($scope.belt_categories, function (category) {
        angular.forEach($scope.belt_groups[category.id], function (item) {
          $scope.belt_graphs[category.id][item.id].id = item.id;
          if(item.sub_groups.length > 0) {
            var sum = 0;
            angular.forEach(item.sub_groups, function (sub) {
              $scope.belt_graphs[category.id][item.id].sub_groups[sub.id] = { 
                id: sub.id, 
                sum: $filter('sum')($scope.transect.belt.data[item.id]['sub_groups'][sub.id]), 
                mean: $filter('mean')($scope.transect.belt.data[item.id]['sub_groups'][sub.id]), 
                sd: $filter('sd')($scope.transect.belt.data[item.id]['sub_groups'][sub.id]), 
                se: $filter('sd')($scope.transect.belt.data[item.id]['sub_groups'][sub.id])/Math.sqrt($scope.segments_total)
              };
              sum += $scope.belt_graphs[category.id][item.id].sub_groups[sub.id].sum;
            });
            // console.log($scope.transect.belt.data)
              
          }
          $scope.belt_graphs[category.id][item.id].sum = $filter('sum')($scope.transect.belt.data[item.id]);
          $scope.belt_graphs[category.id][item.id].mean = $filter('mean')($scope.transect.belt.data[item.id]);
          $scope.belt_graphs[category.id][item.id].sd = $filter('sd')($scope.transect.belt.data[item.id]);
          $scope.belt_graphs[category.id][item.id].se = $filter('sd')($scope.transect.belt.data[item.id])/Math.sqrt($scope.segments_total);
        });
      });
    }

    $scope.updateBeltGraphsData = function() {
      angular.forEach($scope.belt_graphs, function (val, key) {
        var error_y = [], y = [];
        angular.forEach(val, function (item) {
          y.push(item.mean);
          error_y.push(item.se);
        });
        $scope.belt_graphs_data[key].data[0].y = y;
        $scope.belt_graphs_data[key].data[0].error_y.array = error_y;
        // console.log($filter('filter')(val,'sum'))
        // angular.forEach(val, function (item) {
        //   $scope.belt_graphs[item.id] = {
        //     sum: $filter('sum')($scope.transect.belt.data[item.id]),
        //     mean: $filter('mean')($scope.transect.belt.data[item.id]),
        //     sd: $filter('sd')($scope.transect.belt.data[item.id]),
        //     se: $scope.belt_graphs[item.id].sd/Math.sqrt(MASCREF_CONF.TRANSECT_SEGMENTS_TOTAL)
        //   }
        // });
      });
      // console.log($scope.belt_graphs_data)
    }

    $scope.sum = function (data,prop) {
      return $filter('sum')(data,prop);
    }

    $scope.save = function () {
      //if($scope.validateForm()) return false;
      $scope.response = {}
      // 0 - Check if site has id, otherwise create everything
      if($scope.transect.info.site && !$scope.transect.info.site.id) {
        // 1 - Check if country has id, otherwise create
        if($scope.transect.info.country && !$scope.transect.info.country.id) $scope.saveCountry();
        // 2 - Check if province is not null and has an id, otherwise create
        else if($scope.transect.info.province && !$scope.transect.info.province.id) $scope.saveProvince();
        // 3 - Check if town has id, otherwise create
        else if($scope.transect.info.town && !$scope.transect.info.town.id) $scope.saveTown();
        // 4 - Finally create the site
        else 
          if(!$scope.transect.info.country.id) {
            // Select Country
            $scope.response = { type: 'error', message: 'Country is required' }
            return false;
          }
          else if(!$scope.transect.info.town.id) {
            // Select Town / Island
            $scope.response = { type: 'error', message: 'Town / Island is required' }
            return false;
          }
          else if(!$scope.transect.info.coords.dd.lat) {
            // Select Latitude
            $scope.response = { type: 'error', message: 'Latitude is required' }
            return false;
          }
          else if(!$scope.transect.info.coords.dd.long) {
            // Select Latitude
            $scope.response = { type: 'error', message: 'Longitude is required' }
            return false;
          }
          else {
            $scope.saveSite();
          }
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

    // $scope.updateCoordsDD = function() {
    //   var ddLat = 0;
    //   var ddLong = 0;
    //   if($scope.transect.info.coords.dms.lat.deg) {
    //     var pLat = [];
    //     // pLat.push('');
    //     pLat.push($scope.transect.info.coords.dms.lat.deg * $scope.transect.info.coords.dms.lat.hemisphere);
    //     pLat.push($scope.transect.info.coords.dms.lat.min ? $scope.transect.info.coords.dms.lat.min : 0);
    //     pLat.push($scope.transect.info.coords.dms.lat.sec ? $scope.transect.info.coords.dms.lat.sec : 0);
    //     ddLat = coordinateFilterFilter(pLat.join(' '), 'toDD', 'lat', 5);
    //   }
    //   if($scope.transect.info.coords.dms.long.deg) {
    //     var pLong = [];
    //     // pLat.push('');
    //     pLong.push($scope.transect.info.coords.dms.long.deg * $scope.transect.info.coords.dms.long.hemisphere);
    //     pLong.push($scope.transect.info.coords.dms.long.min ? $scope.transect.info.coords.dms.long.min : 0);
    //     pLong.push($scope.transect.info.coords.dms.long.sec ? $scope.transect.info.coords.dms.long.sec : 0);
    //     ddLong = coordinateFilterFilter(pLong.join(' '), 'toDD', 'lon', 5);
    //   }
    //   $scope.transect.info.coords.dd.lat = ddLat;
    //   $scope.transect.info.coords.dd.long = ddLong;
    // }

    // $scope.updateCoordsDMS = function() {
    //   var dmsLat = coordinateFilterFilter($scope.transect.info.coords.dd.lat, 'toDMS');
    //   var dmsLong = coordinateFilterFilter($scope.transect.info.coords.dd.long, 'toDMS');
    //   if(dmsLat) {
    //     $scope.transect.info.coords.dms.lat = {
    //       hemisphere: ($scope.transect.info.coords.dd.lat > 0) ? 1 : -1,
    //       deg: Math.abs(dmsLat.deg),
    //       min: dmsLat.min,
    //       sec: dmsLat.sec
    //     };
    //   }

    //   if(dmsLong) {
    //     $scope.transect.info.coords.dms.long = {
    //       hemisphere: ($scope.transect.info.coords.dd.long > 0) ? 1 : -1,
    //       deg: Math.abs(dmsLong.deg),
    //       min: dmsLong.min,
    //       sec: dmsLong.sec
    //     };
    //   }
    // }

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

      // var dmsLat = coordinateFilterFilter($scope.transect.info.site.lat, 'toDMS');
      // var dmsLong = coordinateFilterFilter($scope.transect.info.site.long, 'toDMS');

      $scope.transect.info.coords = {
        dd: {
          lat: $scope.transect.info.site.lat,
          long: $scope.transect.info.site.long,
        },
        // dms: {
        //   lat: {
        //     hemisphere: ($scope.transect.info.site.lat > 0) ? 1 : -1,
        //     deg: dmsLat.deg,
        //     min: dmsLat.min,
        //     sec: dmsLat.sec
        //   },
        //   long: {
        //     hemisphere: ($scope.transect.info.site.long > 0) ? 1 : -1,
        //     deg: dmsLong.deg,
        //     min: dmsLong.min,
        //     sec: dmsLong.sec
        //   }
        // }        
      }

      // console.log(coordinateFilterFilter($scope.transect.info.coords.dd.lat, 'toDMS'))
      // console.log(coordinateFilterFilter($scope.transect.info.coords.dd.long, 'toDMS'))


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
      $('.angular-google-map-container').css('height', '450px');
      // $scope.$watch('transect.info.site.lat', function (newVal, oldVal) {
      //   if ($scope.transect.info.site && $scope.transect.info.site.lat && $scope.transect.info.site.long) {
      //     $scope.initMarkers();
      //   }
      // });
    });


    uiGmapIsReady.promise(2).then(function (maps) {
      // console.log(maps)
      $scope.map.options = { MapTypeId: google.maps.MapTypeId.SATELLITE };
      $scope.$watch('transect.info.site.lat', function (newVal, oldVal) {
        if ($scope.transect.info.site && $scope.transect.info.site.lat && $scope.transect.info.site.long) {
          $scope.initMarkers();
        }
      });
      //$scope.$watch('transect.info.coords.dd.lat', $scope.updateMap);
      //$scope.$watch('transect.info.coords.dd.long', $scope.updateMap);
    });

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
    $scope.getBeltCategories();
    $scope.getGroups('line_groups', 'null', MASCREF_CONF.TRANSECT_TYPE.LINE);    
    if ($stateParams.transectId) $scope.getTransect($stateParams.transectId);
  }]);