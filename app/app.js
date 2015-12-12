'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('LD34', [
  'ngRoute',
  'LD34.home',
]);

app.config(['$routeProvider', function($routeProvider) {
   $routeProvider.otherwise({redirectTo: 'home'});
   $routeProvider.caseInsensitiveMatch = true;
}]);

