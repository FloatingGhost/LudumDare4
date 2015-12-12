
'use strict';

angular.module('LD34.game', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/game', {
    templateUrl: 'game/game.html',
    controller: 'game-Ctrl'
  });
}])

.controller('game-Ctrl', ['$scope', function($scope) {
    }
]);
