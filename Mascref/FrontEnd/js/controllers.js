'use strict';

/* Controllers */

angular.module('app.controllers', ['pascalprecht.translate'])
  .controller('AppCtrl', ['$scope', '$translate', function ($scope, $translate) {
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

  }])
  // Dashboard Controllers
  .controller('DashboardStatsCtrl', ['$scope', '$translate', function ($scope, $translate) {

  }])
  .controller('DashboardRecentCtrl', ['$scope', '$translate', function ($scope, $translate) {

  }])
  // Projects Controllers
  .controller('ProjectsCtrl', ['$scope', '$translate', function ($scope, $translate) {
    $scope.breadcrumbs = [ 'Projects' ];
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