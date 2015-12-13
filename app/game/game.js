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
    $scope.mcdonald = false;
    $scope.money = 1000;  
    $scope.button1stock = 25;
    $scope.button2stock = 25;
    $scope.button1cost = 50;
    $scope.button2cost = 50;
    $scope.dayMax = 40;
    $scope.supply1 = 50;
    $scope.multiplier = 1.0;
    $scope.supply2 = 50;
    $scope.demand1 = 50;
    $scope.demand2 = 50;
    $scope.dayLength = 5; 
    $scope.funding = {president: 0};
    $scope.allowPresidencyRun = false;
    $scope.presidencyRun = false;
    $scope.wallBuilt = false;
    $scope.internetClosed = false;
    $scope.banned = false;
    $scope.president = {
      isPresident: false,
      heldRallys: 0,
      approval: 20,
      required: 51,
      timeleft: 15
    };
    
    $scope.demandMulti = 1;
    $scope.manufactureMulti = 1;
    
    $scope.foundmcdonald = function() {
      if (confirm("Found McDonald Trump? This will cost $10,000, but will increase demand due to massive advertising!")) {
      $scope.mcdonald = true;
      $scope.money -= 10000;
      $scope.demandMulti *= 1.5;
      }
      
    } 

    $scope.abolishCapitalism = function() {
      if (confirm("Abolish Capitalism? This will force your competitors to close, giving you full control over the button markets.\nPress the button comrade.")) {
        location.hash = "/win";
      }
  
    }
   
    $scope.production = {
      quality: 75,
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
    $scope.msg = "BUY BUY BUY";
    $interval(function(){$scope.msg =  Math.random()>0.9?"HAIL TRUMP":Math.random()>0.5?"BUY BUY BUY":"SELL SELL SELL"}, 500);
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


    $scope.update = function() {
     
      $scope.$broadcast("timer-stop");
      $scope.timerRunning = false;
      $scope.$broadcast("timer-add-cd-seconds", $scope.settings.speed);
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
      
      var change1 =3*Math.random() *(supplyRatio1 < 1?1:-1)*Math.floor(20*Math.exp(-supplyRatio1)*0.3); 
      var change2 =3*Math.random() * (supplyRatio2 < 1?1:-1)*Math.floor(20*Math.exp(-supplyRatio2)*0.3);
     
      if ($scope.supply1 < $scope.demand1 && change1 < 0) console.log("WAT");
      var new1 = $scope.priceArray1[$scope.dayMax-1] + change1;
      var new2 = $scope.priceArray2[$scope.dayMax-1] + change2;

      if ($scope.retail.quantity1 > $scope.button1stock) $scope.retail.quantity1 = $scope.button1stock;

      if ($scope.retail.quantity2 > $scope.button2stock) $scope.retail.quantity2 = $scope.button2stock;    
      
      if (new1 < 1) new1 = 1;
      if (new2 < 1) new2 = 1;
      console.log("CHANGE1 " + change1 +", CHANGE 2 " + change2); 
      $scope.priceArray1.push(new1);
      $scope.priceArray2.push(new2);
      //Number of buttons bought
      var numberBought1 = Math.floor(20*Math.random());
      var numberBought2 = Math.floor(20*Math.random()); 
      $scope.supply1 -= numberBought1;
      $scope.supply2 -= numberBought2; 
      var numberMade1 = 1+Math.floor(($scope.demand1 - $scope.supply1)*Math.random())*($scope.demand1-$scope.supply1>10?2:1); 
      var numberMade2 = 1+Math.floor(($scope.demand2 - $scope.supply2)*Math.random())*($scope.demand2-$scope.supply2>10?2:1);
      if ($scope.supply1 > $scope.demand1) {
        numberMade1 = 0;
      }
      if ($scope.supply2 > $scope.demand2) {
        numberMade2 = 0;
      }
      $scope.demand1 -= numberBought1;
      $scope.demand2 -= numberBought2;
      $scope.supply1 += numberMade1;
      $scope.supply2 += numberMade2;
      $scope.competitorsMade1 = numberMade1;
      $scope.competitorsMade2 = numberMade2;
      if ($scope.supply1 < 3) $scope.supply1 = 3;
      if ($scope.supply2 < 3) $scope.supply2 = 3;

      if (Math.abs($scope.demand1 - $scope.supply1) < 100) {
        $scope.demand1 += Math.floor((new1 < 20?2:1) * (new1 > 100?0.5:1)*(24*Math.random()*$scope.demandMulti));
      } else {
        if ($scope.demand1 > $scope.supply1) {
          $scope.demand1 += (2*Math.random()*$scope.demandMulti);  
        } else {
          $scope.demand1 -= Math.floor((new1 < 20?2:1) * (new1 > 100?0.5:1)*(24*Math.random()*$scope.demandMulti));
        }
      }

      if (Math.abs($scope.demand2 - $scope.supply2) < 100) {
        $scope.demand2 += Math.floor((new2 < 20?2:1) * (new2 > 100?0.5:1)*(24*Math.random()*$scope.demandMulti));  
      } else {  
          if ($scope.demand2 > $scope.supply2) {
            $scope.demand2 += (2*Math.random()*$scope.demandMulti); 
          } else {  
            $scope.demand2 -= Math.floor((new2 < 20?2:1) * (new2 > 100?0.5:1)*(24*Math.random()*$scope.demandMulti));
          }        
        }
      if ($scope.demand1 < 10) $scope.demand1 +=5;
      if ($scope.demand2 < 10) $scope.demand2 +=5;
      if ($scope.demand1 < 0) $scope.demand1 = 0;
      if ($scope.demand2 < 0) $scope.demand2 = 0;
      if ($scope.demand1 <=0) $scope.demand1 = Math.floor($scope.supply1/2);
      if ($scope.demand2 <=0) $scope.demand2 = Math.floor($scope.supply2/2);
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
      if ($scope.presidencyRun) $scope.money -= $scope.funding.president;
      $scope.profit =  $scope.money - lastMoney;
      $scope.supply1 += parseInt($scope.retail.quantity1);
      $scope.supply2 += parseInt($scope.retail.quantity2);
      if ($scope.money <= 0) {
        $scope.production.quantity1 = 0;
        $scope.production.quantity2 = 0;
        $scope.retail.quantity1 = 0;
        $scope.retail.quantity2 = 0;
        $scope.presidencyRun = false;
        $scope.funding.president = 0;
        if ($scope.button1stock == 0 && $scope.button2stock == 0) {
          location.hash = "#/lose";
        }
        alert("You are broke! Sell off your stored buttons and attempt not to go bankrupt.");
      };
      
      $scope.ticksPassed += 1;
      $scope.qualitySum += parseInt($scope.production.quality);
      $scope.qualityAverage = parseFloat($scope.qualitySum / $scope.ticksPassed);
    
      if ($scope.qualityAverage > 60) {
        $scope.allowPresidencyRun = true;
      } else {
        $scope.allowPresidencyRun = false;
      }

      //Presidency run
      if ($scope.presidencyRun) {
        if ($scope.president.timeleft > 0) {
          $scope.president.timeleft-=1;
          if (Math.random() > 0.85) {
            var amount = Math.floor(3000 * Math.random());
            alert("You have recieved a donation of $" + amount +" to help you become president");
            $scope.money += amount;
          };
          $scope.president.approval += $scope.funding.president / 200;
        } else {
          $scope.presidencyRun = false;
          if ($scope.president.approval > $scope.president.required) {
            //YAYYY WINNER!
            $scope.president.isPresident = true;
            alert("We will now inaugerate Mr Trump as God-King of the americas"); 
          } else {
            alert("You lost the presidential race! I'm sorry mr trump, try again next time.");
          }
        }
      }

    };

    $scope.ban = function() {
      alert("You are Banned from the UK on the grounds of 'Hate Speech'. Demand goes up because the developer of this game says it does.\nDon't question the trump.");
      $scope.demandMulti *= 1.1; 
      $scope.banned = true;
    }
    
    $scope.runForPresident = function() {
      if (confirm("Run for president? Make sure you have enough money, the presidential race is expensive! (I recommend at least 5k)")) {
      $scope.presidencyRun = true;
      $scope.allowPresidencyRun = false;
      $scope.funding.president = 0;
      $scope.president.timeleft = 30;
      }
    }

    $scope.closeInternet = function() {
      if (confirm("Close up the internet? This will cost $7500 and will bankrupt many online companies, increasing prices (and profits), but it will decrease demand due to bad publicity. Continue?")) {
        $scope.money -= 7500;
        $scope.internetClosed = true;
        $scope.multiplier *= 2;
        $scope.manufactureMulti *=0.75;
        $scope.demandMulti *= 0.75; 
      }
    } 
   
    $scope.buildTheWall = function() {
      if (confirm("Build a wall on the mexican border? This will cost $5000, but will increase demand due to the patriots buying american-made products. Manufacture price will increase though, due to lack of cheap mexican workers. Continue?")) {
        $scope.money -= 5000;
        $scope.wallBuilt = true;
        $scope.manufactureMulti *= 1.25;
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
      var x =  1.1*$scope.manufactureMulti * ($scope.production.quality/100) * $scope.priceArray1[$scope.dayMax];
      if (x < 15) x = 15;
      return x;
    }

    $scope.getPrice2 = function () {
      var x =  1.1*$scope.manufactureMulti*($scope.production.quality/100) * $scope.priceArray2[$scope.dayMax];
      if (x < 15) x = 15;
      return x;

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
    $scope.button1sell = 1;
    $scope.button1buy = 1;
    $scope.button2sell = 1;
    $scope.button2buy = 1;

    $scope.getMaxSell1 = function() {
      return Math.floor($scope.money / $scope.priceArray1[$scope.dayMax]);
    }

    $scope.getMaxSell2 = function() {
      return Math.floor($scope.money / $scope.priceArray2[$scope.dayMax]);
    } 
    $scope.buyButton1 = function() {
      if ($scope.supply1 >= $scope.button1buy && $scope.money >= $scope.button1buy*$scope.priceArray1[$scope.dayMax]) {
        $scope.money -= $scope.priceArray1[$scope.dayMax]*$scope.button1buy;
        $scope.button1stock+=parseInt($scope.button1buy);
        $scope.supply1-=parseInt($scope.button1buy);
      }
      $scope.roundMoney();
      $scope.updateQuantity();
      $scope.button1buy = 0;
    };
    $scope.sellButton1 = function() {
      if ($scope.button1stock >= $scope.button1sell) {
        $scope.money += parseInt($scope.button1sell * $scope.multiplier * $scope.priceArray1[$scope.dayMax]);
        $scope.button1stock -= parseInt($scope.button1sell);
        $scope.supply1+=parseInt($scope.button1sell);
      }
      $scope.roundMoney();
      $scope.updateQuantity();
      $scope.button1sell = 0;
      };

    $scope.buyButton2 = function() {
      if ($scope.supply2 >= $scope.button2buy && $scope.money >=  $scope.button2buy*$scope.priceArray2[$scope.dayMax]) {
        $scope.money -= $scope.priceArray2[$scope.dayMax]*$scope.button2buy;
        $scope.button2stock+=parseInt($scope.button2buy);
        $scope.supply2-=parseInt($scope.button2buy);
      }
      $scope.roundMoney();       
      $scope.updateQuantity();
      $scope.button2buy = 0;
    };
    $scope.sellButton2 = function() {
      if ($scope.button2stock >= $scope.button2sell) {
        $scope.money += parseInt($scope.button2sell * $scope.multiplier * $scope.priceArray2[$scope.dayMax]);
        $scope.button2stock -= parseInt($scope.button2sell);
        $scope.supply2 += parseInt($scope.button2sell);
      }
      $scope.button2sell = 0;
      $scope.roundMoney();
      $scope.updateQuantity();
    };

    $scope.roundMoney = function() {
      $scope.money = Math.round(100*$scope.money) / 100;
    };
  }
]);
