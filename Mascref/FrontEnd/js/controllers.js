'use strict';

/* Controllers */

angular.module('app.controllers', ['pascalprecht.translate'])
  .controller('AppCtrl', function ($scope, $translate, $state, djangoAuth, $location) {
    // add 'no-touch' 'ie' classes to html
      var isTouchDevice = !!('ontouchstart' in window);
      var isIE = !!navigator.userAgent.match(/MSIE/i);
      !isTouchDevice && $('html').addClass('no-touch');
      isIE && $('html').addClass('ie');

    // config
      $scope.app = {
          name: 'Mascref',
          version: '1.0.0',
        // for chart colors
          color: {
              primary: '#7266ba',
              info: '#23b7e5',
              success: '#27c24c',
              warning: '#fad733',
              danger: '#f05050',
              light: '#e8eff0',
              dark: '#3a3f51',
              black: '#1c2b36'
          },
          settings: {
              navbarHeaderColor: 'bg-black',
              navbarCollapseColor: 'bg-black',
              asideColor: 'bg-black',
              headerFixed: true,
              asideFixed: false,
              asideFolded: false
          }
      }

    // angular translate
      $scope.langs = { en: 'English' };
      $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "English";
      $scope.setLang = function (langKey) {
        // set the current lang
          $scope.selectLang = $scope.langs[langKey];
        // You can change the language during runtime
          $translate.use(langKey);
      };

    // login

    // Assume user is not logged in until we hear otherwise
      $scope.authenticated = false;
    // Wait for the status of authentication, set scope var to true if it resolves
      djangoAuth.authenticationStatus(true).then(function () {
        $scope.authenticated = true;
      });
    // Wait and respond to the logout event.
      $scope.$on('djangoAuth.logged_out', function () {
        $scope.authenticated = false;
        $state.go('access.signin');
      });
    // Wait and respond to the log in event.
      $scope.$on('djangoAuth.logged_in', function () {
        $scope.authenticated = true;
      });    

      $scope.logout = function () {
        djangoAuth.logout()
        .then(handleSuccess, handleError);
      }

      $scope.profile = function () {
        djangoAuth.profile()
        .then(function (data) {
          $scope.username = data.username;
          $scope.email = data.email;
          $scope.first_name = data.first_name;
          $scope.last_name = data.last_name;
        }, handleError);
      }

      var handleSuccess = function (data) {
        $scope.response = data;
      }

      var handleError = function (data) {
        $scope.response = data;
      }

      $scope.profile();

  })
  // Dashboard Controllers
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

  }])
  // Projects Controllers
  .controller('ProjectsCtrl', ['$scope', '$translate', '$state', 'Projects', function ($scope, $translate, $state, Projects) {
    // Logged status
      if (!$scope.authenticated) {
        $state.go('access.signin');
      }

    // Projects List
      $scope.projects = {}

      $scope.getProjects = function () {
        Projects.list()
        .then(function (data) {
          $scope.projects = data;
          console.log($scope.projects)
        }, function (error) {
          console.error('Projects list: ' + error);
          $scope.stats.error = error;
        });
      }

      $scope.getProjects();

      $scope.breadcrumbs = ['Projects'];
      console.log($scope.breadcrumbs)
  }])
  .controller('ProjectViewCtrl', ['$scope', '$translate', '$stateParams', 'uiGmapGoogleMapApi', function ($scope, $translate, $stateParams, uiGmapGoogleMapApi) {
    $scope.$parent.breadcrumbs.push('Teste');
    console.log($stateParams);
    $scope.map = { center: { latitude: -18.20, longitude: 179 }, zoom: 7, options: { scrollwheel: false, panControl: false, streetViewControl: false } };

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function (maps) {
      
      $('.angular-google-map-container').css('height', '300px');
    });
  }])
  .controller('ProjectViewSurveyCtrl', ['$scope', '$translate', '$stateParams', 'uiGmapGoogleMapApi', function ($scope, $translate, $stateParams, uiGmapGoogleMapApi) {
    console.log($stateParams);
    $scope.map = { center: { latitude: -18.20, longitude: 179 }, zoom: 7, options: { scrollwheel: false, panControl: false, streetViewControl: false } };

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function (maps) {

      $('.angular-google-map-container').css('height', '300px');
    });
  }])
  // Maps Controllers
  .controller("MapsCtrl", function($scope, uiGmapGoogleMapApi) {
    // Do stuff with your $scope.
    // Note: Some of the directives require at least something to be defined originally!
    $scope.map = { center: { latitude: -18.20, longitude: 179 }, zoom: 7, options: { panControl: false, streetViewControl: false } };

    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function(maps) {

    });
  })
  // Settings Controllers
  .controller('SettingsCtrl', ['$scope', '$translate', function ($scope, $translate) {

  }])
  .controller('SettingsCountriesCtrl', ['$scope', '$translate', function ($scope, $translate) {

  }])
  // Signin
  .controller('AccessSigninCtrl', ['$scope', '$translate', '$state', 'djangoAuth', 'Validate', function ($scope, $translate, $state, djangoAuth, Validate) {
    $scope.model = { 'username': '', 'password': '' };
    $scope.complete = false;
    $scope.login = function (formData) {
      $scope.errors = [];
      Validate.form_validation(formData, $scope.errors);
      console.log(formData.$error)
      if (!formData.$invalid) {
        djangoAuth.login($scope.model.username, $scope.model.password)
        .then(function (data) {
          // success case
          //$location.path("/app");
          $state.go('app.dashboard');
        }, function (data) {
          // error case
          $scope.errors = data;
        });
      }
    }
  }])