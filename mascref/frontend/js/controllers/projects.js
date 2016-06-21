'use strict';

/* Projects Controllers */

angular.module('app.controllers')
  .controller('ProjectsCtrl', ['$scope', '$translate', '$state', '$timeout', '$uibModal', '$log', 'Projects', 'Researchers', function ($scope, $translate, $state, $timeout, $uibModal, $log, Projects, Researchers) {
    // Logged status
    if (!$scope.authenticated) {
      $state.go('access.signin');
    }

    // Projects List Init
    $scope.breadcrumbs = [];
    $scope.alerts = [];
    $scope.projects = {}
    $scope.showNewProject = false;
    $scope.loadingProjects = false;
    $scope.formProject = {}
    $scope.msgs = { 
      saving_project: {
        show: false,
        loading: false,
        type: 'info',
        text: ''
      }
    }

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
      $scope.msgs.saving_project.show = true;
      $scope.msgs.saving_project.loading = true;
      $scope.msgs.saving_project.type = 'info';
      $scope.msgs.saving_project.text = 'Creating new project...';

      $scope.formProject.errors = {}

      Projects.save($scope.formProject)
      .then(function (data) {
        $scope.resetFormProject();
        $scope.getProjects();

        $scope.msgs.saving_project.loading = false;
        $scope.msgs.saving_project.type = 'success';
        $scope.msgs.saving_project.text = 'Project created successfully!';
        
        $timeout(function () {
          $state.go('admin.projects.view', { projectId: data.id })
          $scope.showNewProject = false;
        }, 2000);
      }, function (error) {
        $scope.msgs.saving_project.loading = false;
        $scope.msgs.saving_project.loading = false;
        $scope.msgs.saving_project.type = 'danger';
        $scope.msgs.saving_project.text = '(Error) Project create: ' + error;
        // console.error('Project create: ' + error);
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

    // Delete project
    var ModalInstanceCtrl = function ($scope, $uibModalInstance, project) {
      $scope.project = project;
      $scope.title = 'Delete Project ' + project.name;
      $scope.content = 'Warning: By removing you project \''+project.name+'\', you will lose all its related contents (surveys, transects, etc).';

      $scope.ok = function () {
        $uibModalInstance.close($scope.project);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    };

    $scope.deleteProject = function (id, name) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/blocks/modal.html',
        controller: ModalInstanceCtrl,
        resolve: {
          project: function () {
            return { 'id': id, 'name': name };
          }
        }
      });

      modalInstance.result.then(function (project) {
        $scope.addAlert('Your project \''+ project.name +'\' is being deleted...', 'danger');
        Projects.delete(project.id)
        .then(function (data) {
          $scope.closeAlert($scope.alerts.length-1);
          // $log.info('Project ' + itemId + ' deleted at: ' + new Date());
          $scope.addAlert('Your project \''+ project.name +'\' was deleted successfully...', 'success');
          $scope.getProjects();
        }, function (error) {
          $scope.closeAlert();
        });
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }

    $scope.addAlert = function(msg, type) {
      $scope.alerts.push({type: type, msg: msg});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    // Run
    $scope.resetFormProject();
    $scope.getProjects();
    $scope.breadcrumbs[0] = 'Projects';
  }])
  .controller('ProjectEditCtrl', ['$scope', '$translate', '$state', '$stateParams', 'Projects', function ($scope, $translate, $state, $stateParams, Projects) {
    // Logged status
    if (!$scope.authenticated) {
      $state.go('access.signin');
    }

    // project object
    $scope.project = {}    
    $scope.formEditProject = {}
    $scope.msgs = { 
      settings: {
        show: false,
        loading: false,
        type: 'info',
        text: ''
      }
    }
    // $scope.description = "";
    
    // $scope.$watch('project', function (value) {
    //   value.description = "Davi legal mil vezes"
    //   // $scope.description = $scope.project.description
    //   $scope.description = value.description
    //   console.log(value.description)
    // }, true);

    // Retrieve info about the project
    $scope.getProject = function (projectId) {
      Projects.get(projectId)
      .then(function (data) {
        $scope.project = data;
        $scope.$parent.breadcrumbs[1] = $scope.project.name;
      }, function (error) {
        $state.go('admin.projects');
        // $scope.stats.error = error;        
      });
    }

    $scope.saveProject = function () {
      if (!$scope.project.name) {
        console.log('aqui')
        $scope.formProject.errors.name = true;
        return false;
      }
      $scope.msgs.settings.show = true;
      $scope.msgs.settings.loading = true;
      $scope.msgs.settings.type = 'primary';
      $scope.msgs.settings.text = 'Saving project settings...';
      $scope.formProject.errors = {}
      if($scope.formProject.owner) $scope.project.owner = $scope.formProject.owner;
      // if(angular.isObject($scope.description)) $scope.project.description = "";
      // else $scope.project.description = $scope.description;
      Projects.save($scope.project)
      .then(function (data) {
        $scope.msgs.settings.loading = false;
        $scope.msgs.settings.type = 'success';
        $scope.msgs.settings.text = 'Project settings saved successfully!';
      }, function (error) {
        console.error('Project create: ' + error);
      });
    }

    $scope.getProject($stateParams.projectId);
  }])
  .controller('ProjectViewCtrl', ['$scope', '$translate', '$state', '$stateParams', '$sce', '$filter', '$timeout', '$uibModal', '$log', 'Projects', 'Surveys', 'uiGmapGoogleMapApi', function ($scope, $translate, $state, $stateParams, $sce, $filter, $timeout,  $uibModal, $log, Projects, Surveys, uiGmapGoogleMapApi) {
    //******** Projects List Init ********//

    // project object
    $scope.project = {}
    // Surveys and subprojects list
    $scope.surveys = []
    $scope.subProjects = []
    $scope.alerts = [];
    $scope.msgs = { 
      saving_survey: {
        show: false,
        loading: false,
        type: 'info',
        text: ''
      }
    }

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
        $state.go('admin.projects');
        // $scope.stats.error = error;        
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

      $scope.msgs.saving_survey.show = true;
      $scope.msgs.saving_survey.loading = true;
      $scope.msgs.saving_survey.type = 'info';
      $scope.msgs.saving_survey.text = 'Saving survey settings...';

      $scope.formSurvey.errors = {}
      Surveys.save($scope.formSurvey)
      .then(function (data) {
        $scope.msgs.saving_survey.loading = false;
        $scope.msgs.saving_survey.type = 'success';
        $scope.msgs.saving_survey.text = 'Survey created successfully!';

        $scope.getSurveys($stateParams.projectId);
        $timeout(function () {
          $scope.resetFormSurvey();
          $scope.setShowNewSurvey(false);
        }, 3000);
        //$state.go('app.projects.view.survey', { surveyId: data.id })
      }, function (error) {
        $scope.msgs.saving_survey.loading = false;
        $scope.msgs.saving_survey.type = 'danger';
        $scope.msgs.saving_survey.text = '(Error) Sruvey create: ' + error;
        // $scope.formSurvey.errors.others = error;
      });
    }
    // uiGmapGoogleMapApi is a promise.
    // The "then" callback function provides the google.maps object.
    uiGmapGoogleMapApi.then(function (maps) {
      $('.angular-google-map-container').css('height', '300px');
    });

    // Delete project
    var ModalInstanceCtrl = function ($scope, $uibModalInstance, survey) {
      $scope.survey = survey;
      $scope.title = 'Delete Survey ' + survey.name;
      $scope.content = 'Warning: By removing your survey \''+survey.name+'\', you will lose all its related contents (transects, etc).';

      $scope.ok = function () {
        $uibModalInstance.close($scope.survey);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    };

    $scope.deleteSurvey = function (id, name) {
      var modalInstance = $uibModal.open({
        templateUrl: 'tpl/blocks/modal.html',
        controller: ModalInstanceCtrl,
        resolve: {
          survey: function () {
            return { 'id': id, 'name': name };
          }
        }
      });

      modalInstance.result.then(function (survey) {
        $scope.addAlert('Your survey \''+ survey.name +'\' is being deleted...', 'danger');
        Surveys.delete(survey.id)
        .then(function (data) {
          $scope.closeAlert($scope.alerts.length-1);
          // $log.info('Project ' + itemId + ' deleted at: ' + new Date());
          $scope.addAlert('Your survey \''+ survey.name +'\' was deleted successfully...', 'success');
          $scope.getSurveys();
        }, function (error) {
          $scope.closeAlert();
        });
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    }

    $scope.addAlert = function(msg, type) {
      $scope.alerts.push({type: type, msg: msg});
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    //******** Run ********//
    $scope.resetFormSurvey();
    $scope.getProject($stateParams.projectId);
    $scope.getSubProjects($stateParams.projectId);
    $scope.getSurveys($stateParams.projectId);
  }])