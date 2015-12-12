
'use strict';

angular.module('LD34.game', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/game', {
    templateUrl: 'game/game.html',
    controller: 'game-Ctrl'
  });
}])

.controller('game-Ctrl', ['$scope', "$interval", function($scope, $interval) {
    $scope.money = 10000;  
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

    $scope.retail = {
      quantity1: 5,
      quantity2: 3
    };

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
      
      var newPrice1 = ($scope.priceArray1[$scope.dayMax - 1]) + (Math.random()*5*($scope.supplyRatio1 > 1? -1:1));
      var newPrice2 = ($scope.priceArray2[$scope.dayMax - 1]) + (Math.random()*5*($scope.supplyRatio1 > 1? -1:1)); 
      if (newPrice1 <= 1) newPrice1 = 1;
      if (newPrice2 <= 1) newPrice2 = 1;
      $scope.priceArray1.push(newPrice1);
      $scope.priceArray2.push(newPrice2);

      //Number of buttons bought
      var numberBought1 = Math.floor(0.2*Math.exp(Math.E, ($scope.supply1 - $scope.demand1)*Math.random()));
      var numberBought2 = Math.floor(0.2*Math.exp(Math.E, ($scope.supply2 - $scope.demand2)*Math.random())); 
      $scope.supply1 -= numberBought1;
      $scope.supply2 -= numberBought2; 
      
      if ($scope.supply1 < 0) $scope.supply1 = 0;
      if ($scope.supply2 < 0) $scope.supply2 = 0;
      $scope.demand1 -= Math.floor(6*Math.random()*(Math.random()>0.5?1:-1))
      $scope.demand2 -= Math.floor(6*Math.random()*(Math.random()>0.5?1:-1));
      if ($scope.demand1 < 0) $scope.demand1 = 0;
      if ($scope.demand2 < 0) $scope.demand2 = 0;
      var karr = [];
      for (i = 0; i < $scope.dayMax; i++) {
        karr.push(i + 1);
      } 
      var data = {x: karr, y: $scope.priceArray1, name: "Button 1", type: 'scatter'};       
        var data2 = {x: karr, y: $scope.priceArray2, name: "Button 2",  type: 'scatter'};
        var layout = {title: "Button Market", yaxis: { title: "Price ($)" }, 
                      xaxis: {title: "Days"},margin: {l: 40, r: 30,  b: 30, t: 30}};
      Plotly.newPlot("graph", [data, data2], layout);

      //Manufacture buttons
      $scope.button1stock += $scope.production.quantity1 - $scope.retail.quantity1;
      $scope.button2stock += $scope.production.quantity2 - $scope.retail.quantity2;
      $scope.money -= $scope.production.quantity1 * $scope.getPrice1();
      $scope.money -= $scope.production.quantity2 * $scope.getPrice2();
      $scope.money += $scope.retail.quantity1 * $scope.getPrice1();
      $scope.money += $scope.retail.quantity2 * $scope.getPrice2();
      $scope.supply1 += $scope.retail.quantity1;
      $scope.supply2 += $scope.retail.quantity2;
      if ($scope.money <= 0) {
        $scope.production.quantity1 = 0;
        $scope.production.quantity2 = 0;
        $scope.retail.quantity1 = 0;
        $scope.retail.quantity2 = 0;
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
      var x = Math.floor(($scope.money- $scope.production.quantity2*$scope.getPrice2())/$scope.getPrice1());
      if (x <= 0) return 0; 
      return x;
    };

    $scope.getMaxProd2 = function() {
      var x = Math.floor(($scope.money - $scope.production.quantity1*$scope.getPrice1())/$scope.getPrice2());
    if (x <= 0) return 0;
    return x;
    };


    $scope.getBudgetUsed = function() {
      return ($scope.getPrice1() * $scope.production.quantity1) + ($scope.getPrice2() * $scope.production.quantity2);
    };
   
    $scope.buyButton1 = function() {
      if ($scope.supply1 > 0 && $scope.money > $scope.priceArray1[$scope.dayMax]) {
        $scope.money -= $scope.priceArray1[$scope.dayMax];
        $scope.button1stock+=1;
        $scope.supply1-=1;;
      }
      $scope.roundMoney();
    };
    $scope.sellButton1 = function() {
      if ($scope.button1stock > 0) {
        $scope.money += $scope.priceArray1[$scope.dayMax];
        $scope.button1stock -= 1;
        $scope.supply1+=1;
      }
      $scope.roundMoney();
    };

    $scope.buyButton2 = function() {
      if ($scope.supply2 > 0 && $scope.money > $scope.priceArray2[$scope.dayMax]) {
        $scope.money -= $scope.priceArray2[$scope.dayMax];
        $scope.button2stock+=1;
        $scope.supply2-=1;
      }
      $scope.roundMoney();       
      $scope.updateQuantity();
    };
    $scope.sellButton2 = function() {
      if ($scope.button2stock > 0) {
        $scope.money += $scope.priceArray2[$scope.dayMax];
        $scope.button2stock -= 1;
        $scope.supply2 += 1;
      }
      $scope.roundMoney();
      $scope.updateQuantity();
    };

    $scope.roundMoney = function() {
      $scope.money = Math.round(100*$scope.money) / 100;
    };
  }
]);
