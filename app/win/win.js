
'use strict';

angular.module('LD34.win', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/win', {
    templateUrl: 'win/win.html',
    controller: 'win-Ctrl'
  });
}])

.controller('win-Ctrl', ['$scope', function($scope) {
    }
]);
