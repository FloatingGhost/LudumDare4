
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
      if ($scope.money > $scope.priceArray1[10]) {
        $scope.money -= $scope.priceArray1[10];
        $scope.button1stock+=1;
      }
      $scope.roundMoney();
    };
    $scope.sellButton1 = function() {
      if ($scope.button1stock > 0) {
        $scope.money += $scope.button1cost;
        $scope.button1stock -= 1;
      }
      $scope.roundMoney();
    };

    $scope.buyButton2 = function() {
      if ($scope.money > $scope.button2cost) {
        $scope.money -= $scope.button2cost;
        $scope.button2stock+=1;
      }
      $scope.roundMoney();       
    };
    $scope.sellButton2 = function() {
      if ($scope.button1stock > 0) {
        $scope.money += $scope.button2cost;
        $scope.button2stock -= 1;
      }
      $scope.roundMoney();
    };

    $scope.roundMoney = function() {
      $scope.money = Math.round(100*$scope.money) / 100;
    };
  }
]);
