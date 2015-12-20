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
  .controller('ProjectsCtrl', ['$scope', '$translate', '$state', '$timeout', 'Projects', 'Researchers', function ($scope, $translate, $state, $timeout, Projects, Researchers) {
    // Logged status
      if (!$scope.authenticated) {
        $state.go('access.signin');
      }

    // Projects List Init
      $scope.breadcrumbs = [];
      $scope.projects = {}
      $scope.showNewProject = false;
      $scope.formProject = {}

    // Functions
      $scope.resetFormProject = function () {
        $scope.formProject = {
          name: '',
          description: '',
          restricted: false,
          owner: '',
          errors: {}
        }
      }

      $scope.formNewProjectSubmit = function () {
        if (!$scope.formProject.name) {
          $scope.formProject.errors.name = true;
          return false;
        }
        $scope.loadingNewProject = true;
        $scope.formProject.errors = {}
        Projects.create($scope.formProject)
        .then(function (data) {
          $scope.resetFormProject();
          $scope.getProjects();
          $scope.showNewProject = false;
          $scope.loadingNewProject = false;          
          //$timeout(function () {
            $state.go('app.projects.view', { projectId: data.id })
          //}, 2000);
        }, function (error) {
          console.error('Project create: ' + error);
        });
      }

      $scope.getProjects = function (parent) {
        Projects.list('null')
        .then(function (data) {
          $scope.projects = data;
          //console.log($scope.projects)
        }, function (error) {
          //console.error('Projects list: ' + error);
          //$scope.stats.error = error;
        });
      }

      $scope.getResearchers = function (val) {
        return Researchers.list(val)
        .then(function (data) {
          var researchers = [];
          angular.forEach(data, function (item) {
            researchers.push(item);
          });
          console.log(researchers)
          return researchers;
        });
      };

    // Run
      $scope.resetFormProject();
      $scope.getProjects();
      $scope.breadcrumbs[0] = 'Projects';
  }])
  .controller('ProjectViewCtrl', ['$scope', '$translate', '$state', '$stateParams', '$sce', '$filter', 'Projects', 'Surveys', 'uiGmapGoogleMapApi', function ($scope, $translate, $state, $stateParams, $sce, $filter, Projects, Surveys, uiGmapGoogleMapApi) {
    //******** Projects List Init ********//

    // project object
    $scope.project = {}
    // Surveys and subprojects list
    $scope.surveys = []
    $scope.subProjects = []
    // Info about totals
    $scope.info = { 'members': 0, 'surveys': 0, 'transects_count': 0, 'transects_cover': 0 }    
    // Init Google Maps
    $scope.map = {
      center: {
        latitude: -18.20, longitude: 179
      },
      zoom: 7,
      options: {
        scrollwheel: false,
        panControl: false,
        streetViewControl: false
      }
    };
    // Hide New Survey Form and set initial form object
    $scope.showNewSurvey = true;
    $scope.formSurvey = {
      //date_start: new Date()
    }
    // Date options for datepickers
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      class: 'datepicker'
    };

    //******** Begin Functions ********//

    // Open Datepickers
    $scope.toggleOpenDatePicker = function ($event, scopeId) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[scopeId] = !$scope[scopeId];
    };
    // Reset New Survey Form
    $scope.resetFormSurvey = function () {
      $scope.formSurvey = {
        project: $stateParams.projectId,
        name: '',
        date_start: null,
        date_end: null,
        restricted: false,
        owner: '',
        errors: {}
      }
    }
    // Retrieve info about the project
    $scope.getProject = function (projectId) {
      Projects.get(projectId)
      .then(function (data) {
        $scope.project = data;
        $scope.project.description = $sce.trustAsHtml($scope.project.description);
        $scope.$parent.breadcrumbs[1] = $scope.project.name;
        //console.log($scope.project)
      }, function (error) {
        $state.go('app.projects');
        //console.error('Project get: ' + error);
        //$scope.stats.error = error;        
      });
    }    
    // Retrieve the list of sub-projects children of this project
    $scope.getSubProjects = function (parent) {
      Projects.list(parent)
      .then(function (data) {
        $scope.subProjects = data;
        //console.log($scope.subProjects)
      }, function (error) {
        console.error('SubProjects list: ' + error);
        //$scope.stats.error = error;
      });
    }
    // Retrieve the list of Surveys children of this project
    $scope.getSurveys = function (projectId) {
      Surveys.list(projectId)
      .then(function (data) {
        $scope.surveys = data;
        //console.log($scope.subProjects)
      }, function (error) {
        console.error('Surveys list: ' + error);
        //$scope.stats.error = error;
      });
    }
    // Create new Survey
    $scope.setSurvey = function () {
      $scope.formSurvey.errors = {}
      if (!$scope.formSurvey.name) {
        $scope.formSurvey.errors.name = true;
        return false;
      }
      if (!$scope.formSurvey.date_start) {
        $scope.formSurvey.errors.date_start = true;
        return false;
      }

      // Format Dates
      if ($scope.formSurvey.date_start) $scope.formSurvey.date_start = $filter('date')($scope.formSurvey.date_start, 'yyyy-MM-dd');
      if ($scope.formSurvey.date_end) $scope.formSurvey.date_end = $filter('date')($scope.formSurvey.date_end, 'yyyy-MM-dd');

      $scope.loadingNewSurvey = true;
      $scope.formSurvey.errors = {}
      console.log($scope.formSurvey);
      Surveys.create($scope.formSurvey)
      .then(function (data) {
        $scope.resetFormSurvey();
        $scope.getSurveys();
        $scope.showNewSurvey = false;
        $scope.loadingNewSurvey = false;
        $state.go('app.projects.view.survey', { surveyId: data.id })
      }, function (error) {
        $scope.formSurvey.errors.others = error;
        //console.log($scope.formSurvey.errors.others)
        //console.error('Survey create: ' + error);
      });
    }
    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function (maps) {      
      $('.angular-google-map-container').css('height', '300px');
    });


    //******** Run ********//
    $scope.resetFormSurvey();
    $scope.getProject($stateParams.projectId);
    $scope.getSubProjects($stateParams.projectId);
    $scope.getSurveys($stateParams.projectId);

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