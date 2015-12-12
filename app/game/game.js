
'use strict';

angular.module('LD34.game', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/game', {
    templateUrl: 'game/game.html',
    controller: 'game-Ctrl'
  });
}])

.controller('game-Ctrl', ['$scope', function($scope) {
    $scope.money = 1000;  
    $scope.button1stock = 5;
    $scope.button2stock = 5;
    $scope.button1cost = 50;
    $scope.button2cost = 30;

    $scope.buyButton1 = function() {
      if ($scope.money > $scope.button1cost) {
        $scope.money -= $scope.button1cost;
      }
    };
  }
]);
