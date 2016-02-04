'use strict';

/* Projects Controllers */

angular.module('app.controllers')
  .controller('ProjectsCtrl', ['$scope', '$translate', '$state', '$timeout', 'Projects', 'Researchers', function ($scope, $translate, $state, $timeout, Projects, Researchers) {
    // Logged status
    if (!$scope.authenticated) {
      $state.go('access.signin');
    }

    // Projects List Init
    $scope.breadcrumbs = [];
    $scope.projects = {}
    $scope.showNewProject = false;
    $scope.loadingProjects = false;
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
      $scope.loadingProjects = true;
      Projects.list('null')
      .then(function (data) {
          $scope.loadingProjects = false;
          $scope.projects = data;
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
        return researchers;
      });
    };

    // Run
    $scope.resetFormProject();
    $scope.getProjects();
    $scope.breadcrumbs[0] = 'Projects';
  }])
  .controller('ProjectViewCtrl', ['$scope', '$translate', '$state', '$stateParams', '$sce', '$filter', '$timeout', 'Projects', 'Surveys', 'uiGmapGoogleMapApi', function ($scope, $translate, $state, $stateParams, $sce, $filter, $timeout, Projects, Surveys, uiGmapGoogleMapApi) {
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
    $scope.showNewSurvey = false;
    $scope.formSurvey = {
      //date_start: new Date()
      loadingNewProject: false,
    }
    // Date options for datepickers
    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1,
      class: 'datepicker'
    };

    //******** Begin Functions ********//
    $scope.setShowNewSurvey = function(pBool) {
      $scope.showNewSurvey = pBool;
    }


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
        errors: {},
        loadingNewProject: false,
        message: null,
      }      
    }
    // Retrieve info about the project
    $scope.getProject = function (projectId) {
      Projects.get(projectId)
      .then(function (data) {
        $scope.project = data;
        $scope.project.description = $sce.trustAsHtml($scope.project.description);
        $scope.$parent.breadcrumbs[1] = $scope.project.name;
      }, function (error) {
        $state.go('app.projects');
        //$scope.stats.error = error;        
      });
    }
    // Retrieve the list of sub-projects children of this project
    $scope.getSubProjects = function (parent) {
      Projects.list(parent)
      .then(function (data) {
        $scope.subProjects = data;
      }, function (error) {
        //$scope.stats.error = error;
      });
    }
    // Retrieve the list of Surveys children of this project
    $scope.getSurveys = function (projectId) {
      Surveys.list(projectId)
      .then(function (data) {
        $scope.surveys = data;
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

      $scope.formSurvey.loadingNewSurvey = true;
      $scope.formSurvey.errors = {}
      Surveys.create($scope.formSurvey)
      .then(function (data) {
        $scope.formSurvey.message = "Survey created successfully";
        $scope.getSurveys($stateParams.projectId);
        $timeout(function () {
          $scope.resetFormSurvey();
          $scope.setShowNewSurvey(false);
        }, 3000);
        //$state.go('app.projects.view.survey', { surveyId: data.id })
      }, function (error) {
        $scope.formSurvey.errors.others = error;
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