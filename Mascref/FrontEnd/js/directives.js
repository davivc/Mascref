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
});