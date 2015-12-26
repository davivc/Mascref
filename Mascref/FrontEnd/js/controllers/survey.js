'use strict';

/* Surveys Controllers */

angular.module('app.controllers')
  .controller('SurveyCtrl', ['$scope', '$translate', '$state', '$stateParams', '$sce', 'Surveys', 'Sites', 'uiGmapGoogleMapApi', function ($scope, $translate, $state, $stateParams, $sce, Surveys, Sites, uiGmapGoogleMapApi) {
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
    $scope.map = { center: { latitude: -18.20, longitude: 179 }, zoom: 7, options: { scrollwheel: false, panControl: false, streetViewControl: false } };

    //******** Begin Functions ********//
    // Retrieve info about the project
    $scope.getSurvey = function (pk) {
      Surveys.get(pk)
      .then(function (data) {
        // Check if parent project on the view is the same as the parent on the retrieved survey
        if (data.project != $stateParams.projectId) {
          $state.go('app.projects.view', { projectId: $stateParams.projectId })
        }

        $scope.survey = data;
        $scope.survey.description = $sce.trustAsHtml($scope.survey.description);
        $scope.$parent.breadcrumbs[1] = $scope.survey.name;
      }, function (error) {
        $state.go('app.projects.view', { projectId: $stateParams.projectId });
      });
    }


    $scope.goToTransect = function (pk) {
      $state.go('app.projects.view.survey.transect', { transectId: pk });
    }

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function (maps) {

      $('.angular-google-map-container').css('height', '300px');
    });

    //******** Run ********//
    $scope.getSurvey($stateParams.surveyId);
  }]);