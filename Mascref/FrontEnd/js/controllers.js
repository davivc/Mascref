'use strict';

/* Controllers */

angular.module('app.controllers', ['pascalprecht.translate'])
  .controller('AppCtrl', function ($scope, $rootScope, $translate, $state, djangoAuth, $location, tmhDynamicLocale, User) {
    tmhDynamicLocale.set('en-au');

    $rootScope.userProfile = {};

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
          $rootScope.userProfile = data;
          // $rootScope.$apply()
        }, handleError);
      }

      var handleSuccess = function (data) {
        $scope.response = data;
      }

      var handleError = function (data, status, headers) {
        $scope.response = data;
      }

      $scope.profile();

  }) 
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
  // Signin
  .controller('AccessSigninCtrl', ['$scope', '$translate', '$state', 'djangoAuth', 'Validate', function ($scope, $translate, $state, djangoAuth, Validate) {
    $scope.model = { 'username': '', 'password': '' };
    $scope.complete = false;
    $scope.login = function (formData) {
      $scope.errors = [];
      Validate.form_validation(formData, $scope.errors);
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