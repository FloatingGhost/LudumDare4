
'use strict';

angular.module('LD34.home', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'home-Ctrl'
  });
}])

.controller('home-Ctrl', ['$scope', function($scope) {
    }
]);
