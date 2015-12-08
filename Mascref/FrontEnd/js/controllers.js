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

      var handleSuccess = function (data) {
        $scope.response = data;
      }

      var handleError = function (data) {
        $scope.response = data;
      }

  })
  // Dashboard Controllers
  .controller('DashboardCtrl', ['$scope', '$translate', '$state', function ($scope, $translate, $state) {
       if (!$scope.authenticated) {
        $state.go('access.signin');
       }


        
  }])
  .controller('DashboardStatsCtrl', ['$scope', '$translate', 'djangoAuth', function ($scope, $translate, djangoAuth) {
    $scope.$on('djangoAuth.logged_in', function () {
      console.log('dashstats' + djangoAuth.logged_in);
      //$state.go('access.signin');
    });
  }])
  .controller('DashboardRecentCtrl', ['$scope', '$translate', function ($scope, $translate) {

  }])
  // Projects Controllers
  .controller('ProjectsCtrl', ['$scope', '$translate', function ($scope, $translate) {
    $scope.breadcrumbs = [ 'Projects' ];
    console.log($scope.breadcrumbs)
    //$scope.$on('djangoAuth.logged_in', function () {
    //  $location.path('/');
    //});
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