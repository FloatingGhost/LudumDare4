'use strict';

angular.module('LD34.game', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/game', {
    templateUrl: 'game/game.html',
    controller: 'game-Ctrl'
  });
}])

.controller('game-Ctrl', ['$scope', "$interval", function($scope, $interval) {
    
    $scope.settings = {
      speed: 4,
      play: false
    };
    $scope.money = 10000;  
    $scope.button1stock = 5;
    $scope.button2stock = 5;
    $scope.button1cost = 50;
    $scope.button2cost = 30;
    $scope.dayMax = 20;
    $scope.supply1 = 30;
    $scope.multiplier = 1.0;
    $scope.supply2 = 50;
    $scope.demand1 = 30;
    $scope.demand2 = 50;
    $scope.dayLength = 5; 
    $scope.funding = {president: 0};
    $scope.allowPresidencyRun = false;
    $scope.presidencyRun = false;
    $scope.wallBuilt = false;
    $scope.internetClosed = false;
    $scope.president = {
      isPresident: false,
      heldRallys: 0,
      approval: 20,
      required: 51,
      timeleft: 15
    };
    
   
    $scope.production = {
      quality: 50,
      quantity1: 5,
      quantity2: 3
    }
    $scope.profit = 0;
    $scope.getProfit = function() {
      
    };

    $scope.play = function() {
      $scope.$broadcast('timer-start');
      $scope.settings.play = true;
    }

    $scope.pause = function() {
      $scope.$broadcast('timer-stop');
      $scope.settings.play = false;
    }

    $scope.getRallyCost = function() {
      return 500 * Math.pow(2, $scope.president.heldRallys); 
    };

    $scope.holdRally = function() {
      $scope.money -= $scope.getRallyCost();
      $scope.president.approval += 10;
      $scope.president.heldRallys += 1;
    };

    $scope.retail = {
      quantity1: 5,
      quantity2: 3
    };
    $scope.competitorsMade1 = 0;
    $scope.competitorsMade2 = 0;

    $scope.ticksPassed = 0;
    $scope.qualitySum = 0;
    $scope.qualityAverage = 0;

    $scope.demandMulti = 1;
    $scope.manufactureMulti = 1;

    $scope.update = function() {
      $scope.$broadcast("timer-stop");
      $scope.timerRunning = false;
      $scope.$broadcast("timer-add-cd-seconds", $scope.settings.speed);
      //UPDATE SUPPLY AND DEMAND
      //If demand will fluctuate randomly
      //Supply can be directly influenced by the player
      console.log($scope.funding.president);
      //Update Prices
      var supplyRatio1 = $scope.supply1 / $scope.demand1;
      var supplyRatio2 = $scope.supply2 / $scope.demand2;

      //If high, decrease price
      //If low, increase price
      //Chop off index 1
      $scope.priceArray1 = $scope.priceArray1.splice(1, $scope.dayMax);
      $scope.priceArray2 = $scope.priceArray2.splice(1, $scope.dayMax);
      
      var newPrice1 = ($scope.priceArray1[$scope.dayMax - 1]) + (Math.random()*7*(supplyRatio1 > 1? -1:1));
      var newPrice2 = ($scope.priceArray2[$scope.dayMax - 1]) + (Math.random()*7*(supplyRatio2> 1? -1:1)); 
      if (newPrice1 <= 1) newPrice1 = 1;
      if (newPrice2 <= 1) newPrice2 = 1;
      $scope.priceArray1.push(newPrice1);
      $scope.priceArray2.push(newPrice2);

      //Number of buttons bought
      var numberBought1 = 1+Math.floor(0.2*Math.pow(Math.E, ($scope.supply1 - $scope.demand1)*Math.random()));
      var numberBought2 = 1+Math.floor(0.2*Math.pow(Math.E, ($scope.supply2 - $scope.demand2)*Math.random())); 
      $scope.supply1 -= numberBought1;
      $scope.supply2 -= numberBought2; 
      
      var numberMade1 = 1+Math.floor(15*Math.random())*($scope.demand1-$scope.supply1>20?2:1); 
      var numberMade2 = 1+Math.floor(15*Math.random())*($scope.demand2-$scope.supply2>20?2:1);
      if ($scope.supply1 > $scope.demand1) {
        numberMade1 = 0;
      }
      if ($scope.supply2 > $scope.demand2) {
        numberMade2 = 0;
      }
      $scope.supply1 += numberMade1;
      $scope.supply2 += numberMade2;
      $scope.competitorsMade1 = numberMade1;
      $scope.competitorsMade2 = numberMade2;
      if ($scope.supply1 < 0) $scope.supply1 = 0;
      if ($scope.supply2 < 0) $scope.supply2 = 0;
      $scope.demand1 += Math.floor(8*Math.random()*(Math.random()>(0.5)?$scope.demandMulti:-1))
      $scope.demand2 += Math.floor(8*Math.random()*(Math.random()>(0.5)?$scope.demandMulti:-1));
      if ($scope.demand1 < 10) $scope.demand1 +=5;
      if ($scope.demand2 < 10) $scope.demand2 +=5;
      if ($scope.demand1 < 0) $scope.demand1 = 0;
      if ($scope.demand2 < 0) $scope.demand2 = 0;
      var karr = [];
      for (i = 0; i < $scope.dayMax; i++) {
        karr.push(i + 1);
      } 
      var data = {x: karr, y: $scope.priceArray1, name: "Button 1", type: 'scatter'};       
        var data2 = {x: karr, y: $scope.priceArray2, name: "Button 2",  type: 'scatter'};
        var layout = {title: "Button Market", yaxis: { title: "Price ($)" }, 
                      width: 300, height: 200, autosize: false, xaxis: {title: "Days"},margin: {l: 40, r: 30,  b: 30, t: 30}};
      Plotly.newPlot("graph", [data, data2], layout);

      //Manufacture buttons
      $scope.button1stock += $scope.production.quantity1 - $scope.retail.quantity1;
      $scope.button2stock += $scope.production.quantity2 - $scope.retail.quantity2;
      var lastMoney = $scope.money;
      $scope.money -= $scope.production.quantity1 * $scope.getPrice1();
      $scope.money -= $scope.production.quantity2 * $scope.getPrice2();
      $scope.money += $scope.multiplier * $scope.retail.quantity1 * $scope.priceArray1[$scope.dayMax];
      $scope.money += $scope.multiplier * $scope.retail.quantity2 * $scope.priceArray2[$scope.dayMax];
      $scope.money -= $scope.funding.president;
      $scope.profit =  $scope.money - lastMoney;
      $scope.supply1 += parseInt($scope.retail.quantity1);
      $scope.supply2 += parseInt($scope.retail.quantity2);
      console.log("SUPPLY CHANGING BY " + $scope.retail.quantity1);
      if ($scope.money <= 0) {
        $scope.production.quantity1 = 0;
        $scope.production.quantity2 = 0;
        $scope.retail.quantity1 = 0;
        $scope.retail.quantity2 = 0;
        $scope.presidencyRun = false;
        alert("You are broke! Sell off your stored buttons and attempt not to go bankrupt.");
      };
      
      $scope.ticksPassed += 1;
      $scope.qualitySum += parseInt($scope.production.quality);
      $scope.qualityAverage = parseFloat($scope.qualitySum / $scope.ticksPassed);
    
      if ($scope.qualityAverage > 60) {
        console.log($scope.qualityAverage);
        $scope.allowPresidencyRun = true;
      } else {
        $scope.allowPresidencyRun = false;
      }

      //Presidency run
      if ($scope.presidencyRun) {
        if ($scope.president.timeleft > 0) {
          $scope.president.timeleft-=1;
          if (Math.random() > 0.9) {
            var amount = Math.floor(1500 * Math.random());
            alert("You have recieved a donation of $" + amount +" to help you become president");
            $scope.money += amount;
          };
          $scope.president.approval += $scope.funding.president / 500;
        } else {
          $scope.presidencyRun = false;
          if ($scope.president.approval > $scope.president.required) {
            //YAYYY WINNER!
            $scope.president.isPresident = true;
            alert("We will now inaugerate Mr Trump as God-King of the americas"); 
          }
        }
      }

    };
    
    $scope.runForPresident = function() {
      if (confirm("Run for president?")) {
      $scope.presidencyRun = true;
      $scope.allowPresidencyRun = false;
      $scope.funding.president = 1000;
      $scope.president.timeleft = 5;
      }
    }

    $scope.closeInternet = function() {
      if (confirm("Close up the internet? This will cost $7500 and will bankrupt many online companies, increasing prices (and profits), but it will decrease demand due to bad publicity. Continue?")) {
        $scope.money -= 7500;
        $scope.internetClosed = true;
        $scope.multiplier = 2;
        $scope.demandMulti *= 0.75; 
      }
    } 
   
    $scope.buildTheWall = function() {
      if (confirm("Build a wall on the mexican border? This will cost $5000, but will increase demand due to the patriots buying american-made products. Manufacture price will increase though, due to lack of cheap mexican workers. Continue?")) {
        $scope.money -= 5000;
        $scope.wallBuilt = true;
        $scope.manufactureMulti = 1.5;
        $scope.demandMulti *= 1.5;
      }
    } 

    $scope.updateQuantity = function () {
      if ($scope.production.quantity1 > $scope.getMaxProd1())
        $scope.production.quantity1 = $scope.getMaxProd1();
      if ($scope.production.quantity2 > $scope.getMaxProd2())
        $scope.production.quantity2 = $scope.getMaxProd2();
    };

    $scope.getPrice1 = function () {
      return 0.3*$scope.manufactureMulti * ($scope.production.quality/100) * $scope.priceArray1[$scope.dayMax];
    }

    $scope.getPrice2 = function () {
      return 0.3*$scope.manufactureMulti*($scope.production.quality/100) * $scope.priceArray2[$scope.dayMax];
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
      return parseInt($scope.funding.president) + ($scope.getPrice1() * $scope.production.quantity1) + ($scope.getPrice2() * $scope.production.quantity2);
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
        $scope.money += $scope.multiplier * $scope.priceArray1[$scope.dayMax];
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
        $scope.money += $scope.multiplier * $scope.priceArray2[$scope.dayMax];
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
