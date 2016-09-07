'use strict';

/* Transect Controllers */

angular.module('app.controllers')
  .controller('TransectSiteFormCtrl', 
    [
      '$scope', 
      '$translate',
      '$state', 
      '$stateParams', 
      'Transect', 
      function (
          $scope, 
          $translate, 
          $state, 
          $stateParams,
          Transect
      ) {

        $scope.transect.basic = {

        }

        $scope.$watch('transect.info.id',function(newVal,oldVal) { 
          if(angular.isNumber(newVal)) {
            $scope.getInfo($scope.transect.info.id)
          }
        }, true);

        $scope.getInfo = function (pId) {
          Transect.getInfo(pId)
          .then(function (data) {
            angular.forEach(data, function (v, k) {
              $scope.transect.basic[v['name']] = v;
            });
          }, function (error) {

          });    
        }

        $scope.saveInfo = function() {
          $scope.alert = { 
            type: 'info',
            msg: 'Saving site information...'
          }
          var update = []
          var create = []
          angular.forEach($scope.transect.basic, function (v, k) {
            if(v['id']) update.push(v)
            else create.push({ 'name': k, 'value': v.value, 'transect': $scope.transect.info.id })
          });
          Transect.createMultipleInfos(create).then(function (data) {  
            Transect.updateMultipleInfos(update).then(function (data) { 
              $scope.alert = { 
                type: 'success',
                msg: 'Site information saved successfully!'
              }
              $scope.getInfo($scope.transect.info.id);
            }, function (error) {
              $scope.alert = { 
                type: 'danger',
                msg: 'Ops! It appears that an error occurred while updating some information'
              }
            });
          }, function (error) {
            $scope.alert = { 
              type: 'danger',
              msg: 'Ops! It appears that an error occurred while saving some information'
            }
          });
        }
      }
    ]
  )