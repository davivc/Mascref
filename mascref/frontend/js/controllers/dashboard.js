'use strict';

/* Dashboard Controllers */

angular.module('app.controllers')
  .controller('DashboardCtrl', ['$scope', '$rootScope', '$translate', '$state', 'User', function ($scope, $rootScope, $translate, $state, User) {
    if (!$scope.authenticated) {
      $state.go('access.signin');
    }

    $scope.$watch('userProfile', function(newValue, oldValue) {
      //update the DOM with newValue
      console.log(newValue, oldValue)
    });
  }])
  .controller('DashboardStatsCtrl', ['$scope', '$rootScope', '$translate', '$filter', 'Dashboard', function ($scope, $rootScope, $translate, $filter, Dashboard) {
    $scope.stats = {
      'countries': 0,
      'projects': 0,
      'sites': 0,
      'towns': 0,
      'surveys': 0,
      'transects': 0
    }
    // console.log($rootScope.userProfile)
    $scope.researchers = []
    $scope.totalAdmin = 0;
    $scope.totalMembers = 0;
    $scope.totalResearchers = 0;

    $scope.getStats = function () {
      Dashboard.stats()
      .then(function (data) {
        $scope.stats = data;
        $scope.stats.transects = 0;
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
      $scope.totalAdmin = $filter('filter')($scope.researchers, { is_admin: true }, true).length;
      $scope.totalMembers = $filter('filter')($scope.researchers, { is_staff: true, is_admin: false }, true).length;
      $scope.totalResearchers = $scope.researchers.length - $scope.totalAdmin - $scope.totalMembers;
    });

    $scope.getStats();
    $scope.getResearchers();

  }])
  .controller('DashboardRecentCtrl', ['$scope', '$translate', 'Activity', function ($scope, $translate, Activity) {
    $scope.activity = []

    $scope.getActivities = function () {
      Activity.list()
      .then(function (data) {
        $scope.activity = data;
      }, function (error) {
        $scope.activity.error = error;
      });
    }

    $scope.getActivities();
  }]);