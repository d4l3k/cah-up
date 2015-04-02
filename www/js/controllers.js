angular.module('starter.controllers', ['ngCordova'])

.controller('MenuCtrl', function($scope, Cards) {
  $scope.categories = Object.keys(Cards.categories);
})

.controller('PlayCtrl', function($scope, Cards, $stateParams, $cordovaDeviceMotion, $cordovaVibration, $location) {
  var cards = Cards.categories[$stateParams.category];
  var $center = $('.center.content');
  var stepMult = 1;
  var updateSize = function() {
    var size = 12;
    var step = 10;
    $center.css({'opacity': 0})
    var interval = setInterval(function() {
      step *= stepMult;
      if ($center.outerWidth() < window.innerHeight) {
        size += step;
      } else {
        size -= step/stepMult;
        clearInterval(interval);
        $center.css({'opacity': 1})
      }
      $center.css({
        'font-size': size,
        'line-height': size + 'px',
      });
    }, 1);
  };
  $scope.next = function() {
    var text = cards[Math.floor(cards.length*Math.random())].text
    $center.html(text);
    $center.css({
      'font-size': '',
      'line-height': ''
    });
    updateSize();
    console.log(text);
  };
  $scope.next();

  var advancing = false;
  $scope.advance = function(correct) {
    if ($scope.time == 0) {
      $location.path('#/');
    }
    if (advancing) {
      return;
    }
    if (window.cordova) {
      $cordovaVibration.vibrate(100);
    }
    $scope.statuses.push({
      text: $center.text(),
      correct: correct
    });
    if (correct) {
      $('.text-fit').addClass('correct');
      $center.text('Correct');
      $scope.correct += 1;
    } else {
      $('.text-fit').addClass('pass');
      $center.text('Pass');
      $scope.pass += 1
    }
    $scope.total += 1;
    updateSize();
    advancing = true;
    setTimeout(function() {
      advancing = false;
      $('.text-fit').removeClass('correct').removeClass('pass');
      $scope.next();
    }, 500);
  }

  $scope.correct = 0;
  $scope.pass = 0;
  $scope.total = 0;

  $scope.statuses = [];

  var level = false;

  $scope.time = 60;
  var interval = setInterval(function() {
    $scope.time -= 1;
    $scope.$digest();
    if ($scope.time == 0) {
      clearInterval(interval);
    }
  }, 1000);

  $(window).on('deviceorientation.Play', function(e) {
    var ev = e.originalEvent;
    $scope.ev = ev;
    $scope.msg = "A: "+ev.absolute + ", A: "+ev.alpha;
    $scope.$digest();
    if (level) {
      if (ev.gamma < 45 && ev.gamma > 0) {
        // Correct
        $scope.advance(true);
        level = false;
      } else if(ev.gamma < 0 && ev.gamma > -45) {
        // Pass
        $scope.advance(false);
        level = false;
      }
    } else if (ev.gamma > 45 || ev.gamma < -45) {
      level = true;
    }
  });
  $(document).on('pause.Play', function(e) {
    $location.path('#/');
  });
  $scope.$on('$destroy', function() {
    $(window).off('deviceorientation.Play');
    $(document).off('pause.Play');
  });
});

