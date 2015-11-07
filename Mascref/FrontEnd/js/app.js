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
    'app.filters',
    'app.services',
    'app.directives',
    'app.controllers'
])
.run(
  ['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
  ]
)
.config(
  ['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;

        $urlRouterProvider
            .otherwise('/app/dashboard');
        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                templateUrl: 'tpl/app.html'
            })
            .state('app.dashboard', {
                url: '/dashboard',
                templateUrl: 'tpl/app_dashboard.html'
            })
            .state('app.projects', {
                url: '/projects',
                templateUrl: 'tpl/app_projects.html'
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
                templateUrl: 'tpl/app_settings.html'
            })
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
.config(function (uiGmapGoogleMapApiProvider) {
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
    
}
)
;