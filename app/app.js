'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('LD34', [
  'ngRoute',
  'LD34.home',
  'LD34.game',
  'timer',
]);

app.config(['$routeProvider', function($routeProvider) {
   $routeProvider.otherwise({redirectTo: 'home'});
   $routeProvider.caseInsensitiveMatch = true;
}]);

app.directive('script', function() {
    return {
        restrict: 'E',
        scope: false,
        link: function(scope, elem, attr) {
            if (attr.type === 'text/javascript-lazy') {
                var code = elem.text();
                var f = new Function(code);
                f();
            }
        }
    };
});
