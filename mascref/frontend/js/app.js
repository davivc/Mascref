'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('app', [
    // 'ngAnimate',
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
    'app.factories',
    'app.controllers',
    'reefcheck',
    'maps.controllers',
    'angularMoment',
    'mm.acl',
])
.run(
  ['$rootScope', '$state', '$stateParams', 'djangoAuth', 'AclService', 'ACL', 'ENV_CONF',  
    function ($rootScope, $state, $stateParams, djangoAuth, AclService, ACL, ENV_CONF) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        djangoAuth.initialize(ENV_CONF.api_url + '/rest-auth', true);


        // Set the ACL data. Normally, you'd fetch this from an API or something.
        // The data should have the roles as the property names,
        // with arrays listing their permissions as their value.
        var aclData = {
          // Guest: []
        }

        AclService.flushRoles()
        // AclService.setAbilities(aclData);

        // Attach the member role to the current user
        // AclService.attachRole('Guest');

        ACL.list().then(function (data) {
          angular.forEach(data, function (obj) {
            var groupPermissions = [];
            angular.forEach(obj.permissions, function (permission) {
              groupPermissions.push(permission.codename);
            });
            aclData[obj.name] = groupPermissions;
          });
          // return aclData; 
          AclService.setAbilities(aclData);
        });
        

        djangoAuth.profile().then(function (data) {
          AclService.attachRole(data.userprofile.roles[0])          
        }, function (error) {
          
        });       

        $rootScope.$on('$stateChangeError', function(current, previous, rejection){
            console.log(current, previous, rejection)
          
          // if(rejection === 'Unauthorized'){
            $state.go('access.signin');
          // }
        })
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

        var aclVerification = function(AclService, djangoAuth, q, role, action) {
          AclService.flushRoles();
          return djangoAuth.profile().then(function (data) {
            AclService.attachRole(data.userprofile.roles[0])
            if(AclService.hasRole('Admin') || AclService.can(action)){
              // console.log('run ', AclService.getRoles())
              // Has proper permissions  || AclService.hasRole('Staff')
              return true;
            } else {
              // Does not have permission
              return q.reject('Unauthorized');
            }
          }, function (error) {
            return q.reject('Error retrieving the user profile');
          }); 
        }

        $urlRouterProvider
          .otherwise('/access/404')
          // .rule(function($injector, $location) {
          //   var path = $location.path();
          //   var hasTrailingSlash = path[path.length-1] === '/';

          //   if(hasTrailingSlash) {

          //     //if last charcter is a slash, return the same url without the slash  
          //     var newPath = path.substr(0, path.length - 1); 
          //     return newPath; 
          //   } 

          // });
          
        $stateProvider
          .state('home', {
              url: '/',
              templateUrl: 'tpl/public_index.html',
              controller: 'PublicCtrl',
          })
          .state('admin', {
              // abstract: true,
              url: '/admin',
              templateUrl: 'tpl/app.html',
              controller: 'AdminCtrl',          
              resolve: {
                authenticated: ['djangoAuth', function (djangoAuth) {
                  return djangoAuth.authenticationStatus();
                }]
              }
          })
            .state('admin.dashboard', {
                url: '/dashboard',
                templateUrl: 'tpl/app_dashboard.html',
                controller: 'DashboardCtrl',
                resolve: {
                  authenticated: ['djangoAuth', function (djangoAuth) {
                    return djangoAuth.authenticationStatus();
                  }],
                  acl: ['$q', 'AclService','djangoAuth', function($q, AclService, djangoAuth){
                    return aclVerification(AclService, djangoAuth, $q, '', 'view_admin_dashboard')
                  }]
                }
            })
            .state('admin.projects', {
                url: '/projects',
                templateUrl: 'tpl/app_projects.html',
                controller: 'ProjectsCtrl',
                resolve: {
                  authenticated: ['djangoAuth', function (djangoAuth) {
                    return djangoAuth.authenticationStatus();
                  }],
                  acl: ['$q', 'AclService','djangoAuth', function($q, AclService, djangoAuth){
                    return aclVerification(AclService, djangoAuth, $q, '', 'view_admin_projects') 
                  }]
                } 
            })
              .state('admin.projects.view', {
                url: '/view/{projectId}',
                templateUrl: 'tpl/app_project_view.html'
              })
              .state('admin.projects.edit', {
                url: '/edit/{projectId}',
                templateUrl: 'tpl/app_project_edit.html'
              })
              .state('admin.projects.view.survey', {
                url: '/survey/{surveyId}',
                templateUrl: 'tpl/app_survey.html'
              })
              .state('admin.projects.view.survey.transect', {
                url: '/transect/{transectId}',
                templateUrl: 'tpl/app_transect.html'
              })
              .state('admin.projects.transect.count', {
                url: '/transect/count',
                templateUrl: 'tpl/app_transect_count.html'
              })
              .state('admin.projects.transect.cover', {
                url: '/transect/cover',
                templateUrl: 'tpl/app_transect_cover.html'
              })
            .state('admin.maps', {
                url: '/maps',
                templateUrl: 'tpl/app_maps.html'
            })
            .state('admin.stats', {
                url: '/stats',
                templateUrl: 'tpl/app_stats.html'
            })
            .state('admin.settings', {
                url: '/settings',
                templateUrl: 'tpl/settings.html',
                controller: 'SettingsCtrl',
                resolve: {
                  authenticated: ['djangoAuth', function (djangoAuth) {
                    return djangoAuth.authenticationStatus();
                  }],
                }
            })
              .state('admin.settings.reefcheck', {
                  url: '/reefcheck',
              })
                .state('admin.settings.reefcheck.transects', {
                    url: '/transects',
                })
                .state('admin.settings.reefcheck.places', {
                    url: '/places',
                })
                  .state('admin.settings.reefcheck.places.countries', {
                      url: '/countries',
                  })
                  .state('admin.settings.reefcheck.places.provinces', {
                      url: '/provinces',
                  })
                  .state('admin.settings.reefcheck.places.towns', {
                      url: '/towns',
                  })
                  .state('admin.settings.reefcheck.places.sites', {
                      url: '/sites',
                  })
                .state('admin.settings.reefcheck.groups', {
                    url: '/groups',
                })
              .state('admin.settings.maps', {
                  url: '/maps',
              })
              .state('admin.settings.stats', {
                  url: '/stats',
              })
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
.config(['AclServiceProvider', function (AclServiceProvider) {
  var myConfig = {
    storage: false,
    // storageKey: 'AppAcl'
  };
  AclServiceProvider.config(myConfig);
}])
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
    key: 'AIzaSyARgP4KCpfqdJzKXKiI3zxP0mI9Gh8NpIc',
    v: '3.20', //defaults to latest 3.X anyhow
    // libraries: 'weather,geometry,visualization'
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
  REEFCHECK_LINE: true, // Activate line transect
  REEFCHECK_BELT: true, // Activate belt transect
  REEFCHECK_GROUP_SET_LINE: 11,
  REEFCHECK_GROUP_SET_BELT: 1,
  TRANSECT_TYPE: { BELT: 1, LINE: 2 },
});