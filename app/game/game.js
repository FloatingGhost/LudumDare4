
'use strict';

angular.module('LD34.game', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/game', {
    templateUrl: 'game/game.html',
    controller: 'game-Ctrl'
  });
}])

.controller('game-Ctrl', ['$scope', "$interval", function($scope, $interval) {
    $scope.money = 1000;  
    $scope.button1stock = 5;
    $scope.button2stock = 5;
    $scope.button1cost = 50;
    $scope.button2cost = 30;
    $scope.dayMax = 20;
    $scope.supply1 = 20;
    $scope.supply2 = 50;
    $scope.demand1 = 30;
    $scope.demand2 = 50;
    $scope.dayLength = 5; 
    $scope.production = {
      quality: 50,
      quantity1: 5,
      quantity2: 3
    }

    $scope.update = function() {
      $scope.$broadcast("timer-stop");
      $scope.timerRunning = false;
      $scope.$broadcast("timer-add-cd-seconds", $scope.dayLength);
      //UPDATE SUPPLY AND DEMAND
      //If demand will fluctuate randomly
      //Supply can be directly influenced by the player

      //Update Prices
      var supplyRatio1 = $scope.supply1 / $scope.demand1;
      var supplyRatio2 = $scope.supply2 / $scope.demand2;

      //If high, decrease price
      //If low, increase price
      //Chop off index 1
      $scope.priceArray1 = $scope.priceArray1.splice(1, $scope.dayMax);
      $scope.priceArray2 = $scope.priceArray2.splice(1, $scope.dayMax);
      
      var newPrice1 = ($scope.priceArray1[$scope.dayMax - 1]) + (Math.random()*5*($scope.supplyRatio1 > 1? 1:-1));
      var newPrice2 = ($scope.priceArray2[$scope.dayMax - 1]) + (Math.random()*5*($scope.supplyRatio1 > 2? 1:-1)); 
      
      $scope.priceArray1.push(newPrice1);
      $scope.priceArray2.push(newPrice2);

      if (demand > supply) {
        demand --;
      };
    };

    $scope.updateQuantity = function () {
      if ($scope.production.quantity1 > $scope.getMaxProd1())
        $scope.production.quantity1 = $scope.getMaxProd1();
      if ($scope.production.quantity2 > $scope.getMaxProd2())
        $scope.production.quantity2 = $scope.getMaxProd2();
    };

    $scope.getPrice1 = function () {
      return ($scope.production.quality/100) * $scope.priceArray1[$scope.dayMax];
    }

    $scope.getPrice2 = function () {
      return ($scope.production.quality/100) * $scope.priceArray2[$scope.dayMax];
    };

    $scope.getMaxProd1 = function() {
      return Math.floor(($scope.money- $scope.production.quantity2*$scope.getPrice2())/$scope.getPrice1());
    };

    $scope.getMaxProd2 = function() {
      return Math.floor(($scope.money - $scope.production.quantity1*$scope.getPrice1())/$scope.getPrice2());
    };


    $scope.getBudgetUsed = function() {
      return ($scope.getPrice1() * $scope.production.quantity1) + ($scope.getPrice2() * $scope.production.quantity2);
    };
   
    $scope.buyButton1 = function() {
      if ($scope.money > $scope.priceArray1[$scope.dayMax]) {
        $scope.money -= $scope.priceArray1[$scope.dayMax];
        $scope.button1stock+=1;
      }
      $scope.roundMoney();
    };
    $scope.sellButton1 = function() {
      if ($scope.button1stock > 0) {
        $scope.money += $scope.priceArray1[$scope.dayMax];
        $scope.button1stock -= 1;
      }
      $scope.roundMoney();
    };

    $scope.buyButton2 = function() {
      if ($scope.money > $scope.priceArray2[$scope.dayMax]) {
        $scope.money -= $scope.priceArray2[$scope.dayMax];
        $scope.button2stock+=1;
      }
      $scope.roundMoney();       
      $scope.updateQuantity();
    };
    $scope.sellButton2 = function() {
      if ($scope.button2stock > 0) {
        $scope.money += $scope.priceArray2[$scope.dayMax];
        $scope.button2stock -= 1;
      }
      $scope.roundMoney();
      $scope.updateQuantity();
    };

    $scope.roundMoney = function() {
      $scope.money = Math.round(100*$scope.money) / 100;
    };
  }
]);
