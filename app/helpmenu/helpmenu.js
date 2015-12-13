
'use strict';

angular.module('LD34.helpmenu', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/helpmenu', {
    templateUrl: 'helpmenu/helpmenu.html',
    controller: 'helpmenu-Ctrl'
  });
}])

.controller('helpmenu-Ctrl', ['$scope', function($scope) {
    }
]);
