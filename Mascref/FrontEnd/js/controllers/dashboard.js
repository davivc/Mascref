'use strict';

/* Dashboard Controllers */

angular.module('app.controllers')
  .controller('DashboardCtrl', ['$scope', '$translate', '$state', function ($scope, $translate, $state) {
    if (!$scope.authenticated) {
      $state.go('access.signin');
    }



  }])
  .controller('DashboardStatsCtrl', ['$scope', '$translate', '$filter', 'Dashboard', function ($scope, $translate, $filter, Dashboard) {
    $scope.stats = {
      'countries': 0,
      'projects': 0,
      'sites': 0,
      'towns': 0,
      'surveys': 0,
      'transects': 0
    }

    $scope.researchers = []
    $scope.totalAdmin = 0;
    $scope.totalMembers = 0;
    $scope.totalResearchers = 0;

    $scope.getStats = function () {
      Dashboard.stats()
      .then(function (data) {
        $scope.stats = data;
      }, function (error) {
        console.error('Dash Stats: ' + error);
        $scope.stats.error = error;
      });
    }

    $scope.getResearchers = function () {
      Dashboard.researchers()
      .then(function (data) {
        $scope.researchers = data;
      }, function (error) {
        console.error('Dash Stats: ' + error);
        $scope.researchers.error = error;
      });
    }

    $scope.$watch('researchers', function (data) {
      $scope.totalAdmin = $filter('filter')($scope.researchers, { role: 1 }, true).length;
      $scope.totalMembers = $filter('filter')($scope.researchers, { role: 2 }, true).length;
      $scope.totalResearchers = $filter('filter')($scope.researchers, { role: 3 } && { role: null } && { role: undefined }, true).length;
    });

    $scope.getStats();
    $scope.getResearchers();

  }])
  .controller('DashboardRecentCtrl', ['$scope', '$translate', function ($scope, $translate) {

  }]);