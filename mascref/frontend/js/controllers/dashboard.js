'use strict';

/* Dashboard Controllers */

angular.module('app.controllers')
  .controller('DashboardCtrl', ['$scope', '$rootScope', '$translate', '$state', 'User', 'AclService', function ($scope, $rootScope, $translate, $state, User, AclService) {
    if (!$scope.authenticated) {
      $state.go('access.signin');
    }
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
        console.log(data)
        $scope.researchers = data;
      }, function (error) {
        console.error('Dash Stats: ' + error);
        $scope.researchers.error = error;
      });
    }

    $scope.$watch('researchers', function (data) {
      $scope.totalAdmin = $filter('filter')($scope.researchers, { roles: "Admin" }, true).length;
      $scope.totalStaff = $filter('filter')($scope.researchers, { roles: "Staff" }, true).length;
      $scope.totalMembers = $filter('filter')($scope.researchers, { roles: "Member" }, true).length;
      $scope.totalResearchers = $scope.researchers.length - $scope.totalAdmin - $scope.totalStaff - $scope.totalMembers;
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