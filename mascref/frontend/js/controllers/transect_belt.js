'use strict';

/* Transect Controllers */

angular.module('app.controllers') 
  .controller('TransectBeltFormCtrl', 
    [
      '$scope', 
      '$translate',
      '$state', 
      '$stateParams', 
      '$filter',
      'Group',
      'Segment',
      'TransectFact',
      function (
          $scope, 
          $translate, 
          $state, 
          $stateParams,
          $filter,
          Group,
          Segment,
          TransectFact
      ) {
        
        $scope.type = $scope.config.reefcheck.transect_belt_id;
        $scope.segments_total = $scope.config.reefcheck.segments_total;
        $scope.segments_points = $scope.config.reefcheck.segments_points;
        $scope.segments_length = $scope.config.reefcheck.segments_length;
        $scope.segments_space = $scope.config.reefcheck.segments_space;

        $scope.belt_categories = {}
        $scope.belt_groups = {}

        $scope.belt_graphs_data = TransectFact.belt_graph_data;
        $scope.belt_graphs = {};
        
        $scope.$watch('transect.info.id',function(newVal,oldVal) { 
          if(angular.isNumber(newVal)) {
            $scope.getDataBelt($scope.transect.info.id)
          }
        }, true);

        $scope.$watch('belt_groups',function(oldVal,newVal) { $scope.initBeltGraphs(); }, true);
        $scope.$watch('transect.belt.data',function(oldVal,newVal) { $scope.updateBeltGraphs(); }, true)
        $scope.$watch('belt_graphs',function(newVal,oldVal) { $scope.updateBeltGraphsData(); }, true)

        $scope.getBeltCategories = function () {
          Group.getCategories($scope.type, $scope.config.reefcheck.group_set_belt)
          .then(function (data) {
            $scope.belt_categories = data;
            angular.forEach(data, function (v, k) {
              $scope.getGroups('belt_groups', 'null', $scope.type, v['id']);
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

        $scope.getDataBelt = function (transect) {
          // for (var i = 0 ; i < $scope.segments_total ; ++i){
            Segment.list(transect, $scope.type)
            .then(function (data) {
              angular.forEach(data, function (dV, dK) {
                var i = dV.segment - 1;
                if(dV['parent']) {
                  if(!$scope.transect.belt.data[dV['parent']]) $scope.transect.belt.data[dV['parent']] = { 'sub_groups': [] };
                  if(!$scope.transect.belt.data[dV['parent']]['sub_groups'][dV['group']]) $scope.transect.belt.data[dV['parent']]['sub_groups'][dV['group']] = [];
                  $scope.transect.belt.data[dV['parent']]['sub_groups'][dV['group']][i] = dV;
                  if(!isFinite($scope.transect.belt.data[dV['parent']][i])) $scope.transect.belt.data[dV['parent']][i] = 0;
                  $scope.transect.belt.data[dV['parent']][i] += $scope.transect.belt.data[dV['parent']]['sub_groups'][dV['group']][i];
                  // else 
                }
                else {
                  if(!$scope.transect.belt.data[dV['group']]) $scope.transect.belt.data[dV['group']] = [];
                  $scope.transect.belt.data[dV['group']][i] = dV;              
                }
              });
              console.log($scope.transect.belt.data)
            }, function (error) {

            });
            // break;
          // }
        }

        $scope.extractSegmentsValues = function(groups, points_create) {
          angular.forEach(groups, function (group_data, group_id) {
            if(angular.isDefined(group_data.sub_groups)) {
              $scope.extractSegmentsValues(group_data.sub_groups, points_create);
            }
            else {
              angular.forEach(group_data, function (value, segment_id) {
                var point = {}
                segment_id = parseInt(segment_id);
                point.token = $scope.transect.info.id + '_' + $scope.type + '_' + (segment_id + 1) + '_' + group_id;
                point.transect = $scope.transect.info.id;
                point.segment = segment_id + 1;
                point.type = $scope.type;                
                point.value = value;
                point.group = group_id;
                points_create.push(point)
              });              
            }
          });  
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

        $scope.saveBelt = function() {
          $scope.alert = { 
            type: 'info',
            msg: 'Saving belt transect data...'
          }
          var create = []
          
          $scope.extractSegmentsValues($scope.transect.belt.data, create);
          Segment.createMultiple(create).then(function (data) {
            $scope.alert = {
              type: 'success',
              msg: 'Belt transect saved successfully!'
            }
          }, function (error) {
            $scope.alert = { 
              type: 'danger',
              msg: 'Ops! It appears that an error occurred while saving some data on the belt transect'
            }
          });      
        }

        $scope.getBeltCategories();
      }
    ]
  )
  .controller('TransectBeltGraphCtrl', 
    [
      '$scope', 
      '$translate',
      '$state', 
      '$stateParams', 
      'TransectFact',
      function (
          $scope, 
          $translate, 
          $state, 
          $stateParams,
          TransectFact
      ) {
        $scope.belt_graphs_data = TransectFact.belt_graph_data;
      }
    ]
  )