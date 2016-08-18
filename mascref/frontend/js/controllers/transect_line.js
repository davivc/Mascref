'use strict';

/* Transect Controllers */

angular.module('app.controllers')
  .controller('TransectLineFormCtrl', 
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

        $scope.type = $scope.config.reefcheck.transect_line_id;
        $scope.segments_total = $scope.config.reefcheck.segments_total;
        $scope.segments_points = $scope.config.reefcheck.segments_points;
        $scope.segments_length = $scope.config.reefcheck.segments_length;
        $scope.segments_space = $scope.config.reefcheck.segments_space;

        $scope.$watch('transect.info.id',function(newVal,oldVal) { 
          if(angular.isNumber(newVal)) {
            $scope.getDataLine($scope.transect.info.id)
          }
        }, true);

        $scope.line_graphs_data = TransectFact.line_graph_data;

        $scope.$watch('line_groups',function(oldVal,newVal) {
          // $scope.line_graphs_data = ;
          $scope.updateLineGraphs();
        }, true);

        $scope.$watch('transect.line.data',function(oldVal,newVal) { 
          $scope.updateLineGraphs(); 
        }, true);

        $scope.getGroups = function (model, parent, type, category) {
          Group.list(parent, type, category, $scope.config.reefcheck.group_set_line)
          .then(function (data) {
            if (category) $scope[model][category] = data;
            else $scope[model] = data;
          }, function (error) {

          });    
        }

        $scope.getDataLine = function (transect) {
          angular.forEach($scope.transect.line.data, function (v, k) {
            Segment.list(transect, $scope.type, k + 1)
            .then(function (data) {
              //$scope.line_transect[k] = data
              angular.forEach(data, function (dV, dK) {
                $scope.transect.line.data[k][dV.value-1] = dV;
              });
          // console.log($scope.line_graphs)
            }, function (error) {

            });
          });
        }

        $scope.saveLine = function() {
          $scope.alert = { 
            type: 'info',
            msg: 'Saving line transect data...'
          }
          var create = []
          var update = []
          angular.forEach($scope.transect.line.data, function (seg, k) {
            angular.forEach(seg, function (point, key) {
              if (point.group_name) {
                if (point.group_name.id) point.group = point.group_name.id;
                else point.group = $filter('filter')($scope.line_groups, { name: point.group_name }, true)[0].id;
              }

              if (!point.token) {
                var pad = ('00' + (key + 1)).slice(-2);
                point.token = $scope.transect.info.id + '_' + $scope.type + '_' + (k + 1) + '_' + pad;
                point.transect = $scope.transect.info.id;
                point.segment = k + 1;
                point.type = $scope.type;                
                point.value = key + 1;
                create.push(point)
              }

              else {
                // point.pk = point.token
                delete point.created_at;
                delete point.updated_at;
                // delete point.group_name;
                // delete point.parent;
                // delete point.parent_name;
                update.push(point)
              }
              $scope.transect.line.data[k][key] = point;
              // console.log(point)      
              // Segment.save(point).then(function (data) { $scope.transect.line.data[k][key] = data; }, function (error) { });
            });
          });
          Segment.createMultiple(create).then(function (data) {  
            Segment.updateMultiple(update.slice(0, 5)).then(function (data) { 
              $scope.alert = { 
                type: 'success',
                msg: 'Line transect saved successfully!'
              }
            }, function (error) {
              $scope.alert = { 
                type: 'danger',
                msg: 'Ops! It appears that an error occurred while updating some data on the line transect'
              }
            });
          }, function (error) {
            $scope.alert = { 
              type: 'danger',
              msg: 'Ops! It appears that an error occurred while saving some data on the line transect'
            }
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
          // TransectFact.line_graph_data = $scope.line_graphs_data;
          // console.log(TransectFact.line_graph_data);
          // console.log($scope.line_graphs_data);
        }

        $scope.getGroups('line_groups', 'null', $scope.type); 
      }
    ]
  )
  .controller('TransectLineGraphCtrl', 
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

        $scope.graph_data = TransectFact.line_graph_data;
        $scope.graph_layout = {
          height: 600, 
          width: 1000, 
          title: 'Mean Percent of Substrate Cover with SE bars'
        };
        $scope.plot_options = { 
          showLink: true, 
          displayLogo: false 
        };
      }
    ]
  );