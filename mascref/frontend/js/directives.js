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
      console.log(attr['ngModel'])
      scope.$watch(attr['ngModel'], function (v) {
        console.log('value changed, new value is: ' + v);
      });

      scope.$watch('text', function (value) {
        console.log('text ' + value)
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
.directive('uiNav', ['$timeout', function($timeout) {
  return {
    restrict: 'AC',
    replace: true,
    link: function(scope, el, attr) {
      var _window = $(window);
      var _mb = 768;
      // unfolded
      $(el).on('click', 'a', function(e) {
        var _this = $(this);
        _this.parent().siblings( ".active" ).toggleClass('active');
        _this.parent().toggleClass('active');
        _this.next().is('ul') && e.preventDefault();
        _this.next().is('ul') || ( ( _window.width() < _mb ) && $('.app-aside').toggleClass('show') );
      });

      // folded
      var wrap = $('.app-aside'), next;
      $(el).on('mouseenter', 'a', function(e){
        if ( !$('.app-aside-fixed.app-aside-folded').length || ( _window.width() < _mb )) return;
        var _this = $(this);

        next && next.trigger('mouseleave.nav');

        if( _this.next().is('ul') ){
           next = _this.next();
        }else{
          return;
        }
        
        next.appendTo(wrap).css('top', _this.offset().top - _this.height());
        next.on('mouseleave.nav', function(e){
          next.appendTo(_this.parent());
          next.off('mouseleave.nav');
          _this.parent().removeClass('active');
        });
        _this.parent().addClass('active');
        
      });

      wrap.on('mouseleave', function(e){
        next && next.trigger('mouseleave.nav');
      });
    }
  };
}])
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