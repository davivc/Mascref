'use strict';

/* Transect Controllers */

angular.module('app.controllers')
  .controller('StatsLineCtrl', 
    [
      '$scope', 
      '$translate', 
      '$state',
      '$window',
      'Data',
      'TransectFact',
      function (
          $scope, 
          $translate, 
          $state,
          $window,
          Data,
          TransectFact,
      ){
        // Logged status
        if (!$scope.authenticated) {
          $state.go('access.signin');
        }

        // Init
        $scope.loadingProjects = false;
        $scope.collectedData = false;
        $scope.projects = [];
        $scope.surveys = [];
        $scope.years = [];
        $scope.countries = [];
        $scope.sites = [];
        $scope.data = {};
        $scope.filters = {}

        $scope.graph_data = TransectFact.line_graph_data_pie;

        $scope.graph_layout = {
          height: 600, 
          width: 1000, 
          title: 'Percent of Substrate Cover'
        };
        $scope.plot_options = { 
          showLink: true, 
          displayLogo: false 
        };

        //******** Begin Functions ********//
        $scope.getProjects = function() {
          Data.getSubstrate('json','project')
          .then(function (data) {
            $scope.projects = data;
          }, function (error) {
            
          });
        }

        $scope.getSurveys = function() {
          Data.getSubstrate('json','survey')
          .then(function (data) {
            $scope.surveys = data;
          }, function (error) {
            
          });
        }

        $scope.getYears = function() {
          Data.getSubstrate('json','year')
          .then(function (data) {
            $scope.years = data;
          }, function (error) {
            
          });
        }

        $scope.getCountries = function() {
          Data.getSubstrate('json','country')
          .then(function (data) {
            $scope.countries = data;
          }, function (error) {
            
          });
        }

        $scope.getSites = function() {
          Data.getSubstrate('json','site')
          .then(function (data) {
            $scope.sites = data;
          }, function (error) {
            
          });
        }

        $scope.filter = function(format,show) {
          if(format == 'csv') {
            var qStr = '';
            if ($scope.filters) {
              var query = [];
              if ($scope.filters.project) query.push('project=' + $scope.filters.project);
              if ($scope.filters.survey) query.push('survey=' + $scope.filters.survey);
              if ($scope.filters.year) query.push('year=' + $scope.filters.year);
              if ($scope.filters.country) query.push('country=' + $scope.filters.country);
              if ($scope.filters.site) query.push('site=' + $scope.filters.site);
              if (query.length > 1) qStr = '?' + query.join('&');
              else if (query.length == 1) qStr = '?' + query[0];

            }
            $window.open('/api/data_substrate/?format=csv&show='+show+'&'+qStr);
          }
          else {
            $scope.loadingProjects = true;
            $scope.collectedData = false;
            Data.getSubstrate('json',show, $scope.filters)
            .then(function (data) {
              $scope.loadingProjects = false;
              $scope.collectedData = true;
              $scope.data = data;
              $scope.updateGraph();
            }, function (error) {
              
            });
          }
        }

        $scope.updateGraph = function() {
          var values = [];
          var labels = [];

          angular.forEach($scope.data, function (v, k) {
            values.push(v['count']);
            labels.push(v['group_name']);
          });

          $scope.graph_data = [{
            values: values,
            labels: labels,
            type: 'pie'
          }];
        }

        $scope.getProjects();
        $scope.getSurveys();
        $scope.getYears();
        $scope.getCountries();
        $scope.getSites();
      }
    ]
  );