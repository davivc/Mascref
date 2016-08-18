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

        $scope.$watch('transect.info.id',function(newVal,oldVal) { 
          if(angular.isNumber(newVal)) {
            // $scope.getDataLine($scope.transect.info.id)
          }
        }, true);

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

        $scope.saveBelt = function() {
          $scope.alert = { 
            type: 'info',
            msg: 'Saving belt transect data...'
          }
          var create = []
          var update = []
          console.log($scope.transect.belt.data)
          angular.forEach($scope.transect.belt.data, function (segs, group_id) {
            angular.forEach(segs, function (value, seg_id) {
                var point = {}
                seg_id = parseInt(seg_id);
                point.token = $scope.transect.info.id + '_' + $scope.type + '_' + (seg_id + 1) + '_' + group_id;
                point.transect = $scope.transect.info.id;
                point.segment = seg_id + 1;
                point.type = $scope.type;                
                point.value = value;
                create.push(point)
            });
          });
          console.log(create);
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
      function (
          $scope, 
          $translate, 
          $state, 
          $stateParams
      ) {
      }
    ]
  )