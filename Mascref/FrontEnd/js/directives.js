'use strict';

/* Directives */
// All the directives rely on jQuery.

angular.module('app.directives', ['ui.load'])
.directive('wysiwyg', function () {
  return {
    restrict: 'E',
    // transclude: true,
    scope: { model: '=ngModel'},
    link: function (scope, element, attr) {
      scope.text = scope.model;
      scope.$watch('text', function (value) {
        scope.model = scope.text;
      });
    },
    templateUrl: 'tpl/directives/wysiwyg.html'
  };
})
.directive("contenteditable", function () {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, element, attrs, ngModel) {

      function read() {
        ngModel.$setViewValue(element.html());
      }

      ngModel.$render = function () {
        element.html(ngModel.$viewValue || "");
      };

      element.bind("blur keyup change", function () {
        scope.$apply(read);
      });
    }
  };
})
// https://github.com/alonho/angular-plotly/blob/master/src/angular-plotly.js
.directive('plotly', function($window) {
  return {
    restrict: 'E',
    template: '<div></div>',
    scope: {
      data: '=',
      layout: '=',
      options: '='
    },
    link: function(scope, element) {
      element = element[0].children[0];
      var initialized = false;
      var init = function() {
        if (initialized)
          return;
        else
          initialized = true;
        Plotly.newPlot(element, scope.data, scope.layout, scope.options);
      }

      scope.$watch(function() {
        return [scope.layout, scope.data];
      }, function() {
        if(!scope.data)
          return;
        init();
        element.layout = scope.layout;
        element.data = scope.data;
        Plotly.redraw(element);
      }, true);

      var w = angular.element($window);
      scope.getWindowDimensions = function () {
        return {
          'h': w.height(),
          'w': w.width()
        };
      };
      scope.$watch(scope.getWindowDimensions, function () {
        Plotly.Plots.resize(element);
      }, true);
      w.bind('resize', function () {
        scope.$apply();
      });
    }
  };
});