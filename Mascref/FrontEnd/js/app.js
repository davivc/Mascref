'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ui.router',
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'uiGmapgoogle-maps',
    'pascalprecht.translate',
    'tmh.dynamicLocale',
    'app.env_conf',
    'app.filters',
    'app.services',
    'app.directives',
    'app.controllers',
    'reefcheck.controllers',
    'maps.controllers',
    'angularMoment',
])
.run(
  ['$rootScope', '$state', '$stateParams', 'djangoAuth', 'ENV_CONF',  
    function ($rootScope, $state, $stateParams, djangoAuth, ENV_CONF) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        djangoAuth.initialize(ENV_CONF.api_url + '/rest-auth', true);
    }
  ]
)
.config(
  ['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$locationProvider', 
    function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $locationProvider) {

        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;

        $urlRouterProvider
          .otherwise('/access/404');
        $stateProvider
          .state('home', {
              url: '/',
              templateUrl: 'tpl/public_index.html',
              controller: 'PublicCtrl',
          })
          .state('app', {
              abstract: true,
              url: '/app',
              templateUrl: 'tpl/app.html',                
              resolve: {
                authenticated: ['djangoAuth', function (djangoAuth) {
                  return djangoAuth.authenticationStatus();
                }],
              }
          })
          .state('app.dashboard', {
              url: '/dashboard',
              templateUrl: 'tpl/app_dashboard.html',
              controller: 'DashboardCtrl',
              resolve: {
                authenticated: ['djangoAuth', function (djangoAuth) {
                  return djangoAuth.authenticationStatus();
                }],
              }
          })
          .state('app.projects', {
              url: '/projects',
              templateUrl: 'tpl/app_projects.html',
              controller: 'ProjectsCtrl',
              resolve: {
                  authenticated: ['djangoAuth', function (djangoAuth) {
                    return djangoAuth.authenticationStatus();
                  }],
                  }
          })
          .state('app.projects.view', {
            url: '/view/{projectId}',
            templateUrl: 'tpl/app_project_view.html'
          })
          .state('app.projects.view.survey', {
            url: '/survey/{surveyId}',
            templateUrl: 'tpl/app_survey.html'
          })
          .state('app.projects.view.survey.transect', {
            url: '/transect/{transectId}',
            templateUrl: 'tpl/app_transect.html'
          })
          .state('app.projects.transect.count', {
            url: '/transect/count',
            templateUrl: 'tpl/app_transect_count.html'
          })
          .state('app.projects.transect.cover', {
            url: '/transect/cover',
            templateUrl: 'tpl/app_transect_cover.html'
          })
          .state('app.maps', {
              url: '/maps',
              templateUrl: 'tpl/app_maps.html'
          })
          .state('app.stats', {
              url: '/stats',
              templateUrl: 'tpl/app_stats.html'
          })
          .state('app.settings', {
              url: '/settings',
              templateUrl: 'tpl/settings.html',
              controller: 'SettingsCtrl',
              resolve: {
                authenticated: ['djangoAuth', function (djangoAuth) {
                  return djangoAuth.authenticationStatus();
                }],
              }
          })
          // .state('app.settings.countries', {
          //   url: '/countries',
          //   templateUrl: 'tpl/app_settings_countries.html'
          // })
          // others
          .state('access', {
            url: '/access',
            template: '<div ui-view class="fade-in-right-big smooth"></div>'
          })
          .state('access.signin', {
            url: '/signin',
            templateUrl: 'tpl/signin.html',
            controller: 'AccessSigninCtrl'
          })
          .state('access.forgotpwd', {
            url: '/forgotpwd',
            templateUrl: 'tpl/forgotpwd.html'
          })
          .state('access.404', {
            url: '/404',
            templateUrl: 'tpl/404.html'
          });
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: true
        });
    }
  ]
)
.config(['$translateProvider', function ($translateProvider) {

    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
        prefix: 'l10n/',
        suffix: '.json'
    });

    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('en');

    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();

}])
// Google MAPS
.config(function ($httpProvider, uiGmapGoogleMapApiProvider) {
  //$httpProvider.defaults.xsrfCookieName = 'csrftoken';
  //$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  //$httpProvider.defaults.headers.post['X-CSRFToken'] = $('input[name=csrfmiddlewaretoken]').val();  

  uiGmapGoogleMapApiProvider.configure({
    //    key: 'your api key',
    v: '3.20', //defaults to latest 3.X anyhow
    libraries: 'weather,geometry,visualization'
  });
})

/**
 * jQuery plugin config use ui-jq directive , config the js and css files that required
 * key: function name of the jQuery plugin
 * value: array of the css js file located
 */

.constant('JQ_CONFIG', {
  dataTable: [
    'js/jquery/datatables/jquery.dataTables.min.js',
    'js/jquery/datatables/dataTables.bootstrap.js',
    'js/jquery/datatables/dataTables.bootstrap.css'
  ],
  footable: [
    'js/jquery/footable/footable.all.min.js',
    'js/jquery/footable/footable.core.css'
  ],
  wysiwyg: [
    'js/jquery/wysiwyg/bootstrap-wysiwyg.js',
    'js/jquery/wysiwyg/jquery.hotkeys.js'
  ],
})
.value('MASCREF_CONF', {
  COORD: { LAT: -18.15, LONG: 178.4, ZOOM: 12 },
  SIGNIFICANT_DIGITS: 2,
  TRANSECT_SEGMENTS_LENGTH: 20, // Length of segment
  TRANSECT_SEGMENTS_POINTS: 40, // Number of points per segment 
  TRANSECT_SEGMENTS_SPACE: 5, // Space between segments
  TRANSECT_SEGMENTS_TOTAL: 4, // Number of segments per transect  
  TRANSECT_TYPE: { BELT: 1, LINE: 2 },
});