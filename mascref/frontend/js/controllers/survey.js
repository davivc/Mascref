﻿'use strict';

/* Surveys Controllers */

angular.module('app.controllers')
  .controller('SurveyCtrl', ['$scope', '$translate', '$state', '$stateParams', '$sce', '$uibModal', 'Surveys', 'Transect', 'uiGmapGoogleMapApi', 'uiGmapIsReady','MASCREF_CONF', 'AclService', function ($scope, $translate, $state, $stateParams, $sce, $uibModal, Surveys, Transect, uiGmapGoogleMapApi, uiGmapIsReady, MASCREF_CONF, AclService) {
    // Logged status
    if (!$scope.authenticated) {
      $state.go('access.signin');
    }

    // Survey Init Variables
    $scope.survey = {}
    $scope.transects = []
    $scope.stats = {}
    $scope.members = []
    // Info about totals
    $scope.info = { 'members': 0, 'surveys': 0, 'transects_count': 0, 'transects_cover': 0 }
    // Init Google Maps
    $scope.markersSurvey = []
    $scope.mapSurvey = {
      center: {
        latitude: MASCREF_CONF.COORD.LAT,
        longitude: MASCREF_CONF.COORD.LONG
        //latitude: -27.68,
        //longitude: -48.49
      },
      zoom: MASCREF_CONF.COORD.ZOOM,
      options: { scrollwheel: false, panControl: false, streetViewControl: false }
    };
    $scope.mapSurveyControl = {}

    //******** Begin Functions ********//
    $scope.goToTransect = function(pk) {
      $state.go('admin.projects.view.survey.transect', { transectId: pk });
    }

    // Retrieve info about the project
    $scope.getSurvey = function (pk) {
      Surveys.get(pk)
      .then(function (data) {
        // Check if parent project on the view is the same as the parent on the retrieved survey
        if (data.project != $stateParams.projectId) {
          $state.go('admin.projects.view', { projectId: $stateParams.projectId })
        }

        $scope.survey = data;
        $scope.survey.description = $sce.trustAsHtml($scope.survey.description);
        $scope.$parent.breadcrumbs[1] = $scope.survey.name;
        $scope.getTransects();
      }, function (error) {
        $state.go('admin.projects.view', { projectId: $stateParams.projectId });
      });
    }

    $scope.getTransects = function() {
      Transect.list($scope.survey.id)
      .then(function (data) {
        $scope.transects = data;
      }, function (error) {
        $state.go('admin.projects.view', { projectId: $stateParams.projectId });
      });
    }

    // Delete transect
    var ModalInstanceCtrl = function ($scope, $uibModalInstance, transect) {
      $scope.transect = transect;
      $scope.title = 'Delete Transect ' + transect.name;
      $scope.content = 'Warning: By removing your transect \''+transect.name+'\', you will lose all its contents (line and delt data).';

      $scope.ok = function () {
        $uibModalInstance.close($scope.transect);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    };

    $scope.deleteTransect = function (id, name) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/blocks/modal.html',
        controller: ModalInstanceCtrl,
        resolve: {
          transect: function () {
            return { 'id': id, 'name': name };
          }
        }
      });

      modalInstance.result.then(function (transect) {
        $scope.addAlert('Your transect \''+ transect.name +'\' is being deleted...', 'danger');
        Transect.delete(transect.id)
        .then(function (data) {
          $scope.closeAlert($scope.alerts.length-1);
          // $log.info('Project ' + itemId + ' deleted at: ' + new Date());
          $scope.addAlert('Your transect \''+ transect.name +'\' was deleted successfully...', 'success');
          $scope.getTransects();
        }, function (error) {
          $scope.closeAlert();
        });
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }

    $scope.addAlert = function(msg, type) {
      $scope.alerts.push({type: type, msg: msg});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.initMarkersSurvey = function() {
      $scope.bounds = new google.maps.LatLngBounds();

      angular.forEach($scope.survey.sites, function (item, key) {
        var myLatLng = new google.maps.LatLng(item.lat, item.long);
        $scope.bounds.extend(myLatLng);
        
        $scope.markersSurvey.push({
          id: item.id,
          coords: {
            latitude: item.lat,
            longitude: item.long 
          },
          options: {
            draggable: false,
            show: true,
            title: item.name
          }
        });
      });

      $scope.mapSurvey = { center: { latitude: $scope.bounds.getCenter().lat(), longitude: $scope.bounds.getCenter().lng() } };
      $scope.mapSurvey.options = { MapTypeId: google.maps.MapTypeId.SATELLITE };

      $scope.mapSurveyControl.getGMap().fitBounds($scope.bounds);
      $scope.mapSurveyControl.getGMap().setZoom($scope.mapSurveyControl.getGMap().getZoom())
    }

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function (maps) {
      // console.log($scope.markersSurvey)
      $('.angular-google-map-container').css('height', '300px');
    });

    uiGmapIsReady.promise(1).then(function (maps) {
      $scope.mapSurvey.options = { MapTypeId: google.maps.MapTypeId.SATELLITE };
      $scope.$watch('survey.sites', function (newVal, oldVal) {
        // console.log($scope.survey.sites)
        if ($scope.survey.sites) {
          $scope.initMarkersSurvey();
        }
      });
    });

    //******** Run ********//
    $scope.getSurvey($stateParams.surveyId);
  }]);