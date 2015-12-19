angular.module('starter.controllers', ['ngCordova',])

.controller('HomeCtrl', function($scope,$rootScope,$ionicPlatform,$state,$timeout /*,$cordovaDevice*/) {
    
    $scope.audio_click = new Audio('audio/click.mp3');
        
    $scope.click=function(){
        $scope.audio_click.play();
    }
    
    //$scope.uuid = $cordovaDevice.getUUID();
    // 

    $rootScope.user=$rootScope.user;
        
    $scope.select_usertype=function(user){
      $rootScope.user=user;
      if($rootScope.user.type=='deck'){
          $state.go('home-inviteusers');
        }else{
          $state.go('home-username');
        }
    }
  })

.controller('UsernameCtrl', function($scope,$rootScope, $state) {
    
    $rootScope.user=$rootScope.user;

    $scope.select_username=function(user){
      
        $rootScope.user=user;        
        $state.go('home-acceptinvitation');
    }

   

})
.controller('MasterGameCtrl', function($scope,$rootScope,$state,$interval,Game) {
 
  $rootScope.user=$rootScope.user;
  $scope.players=[];
  //$rootScope.players=$scope.players;
  $scope.get_players=function(){
      Game.players($scope.game_code).then(function(data){
        $scope.players=data; 
        console.log(data);
        $rootScope.players=$scope.players;
      });
  }
  $scope.start_game=function(){
    
    console.log('start the game');
    Game.start_game($scope.game_code).then(function(data){
        console.log('game started!');
        $state.go('game-table');
    
    });

  }


  Game.new().then(function(game_code){
      $scope.game_code=game_code;
      $scope.rootScope=game_code;
      $scope.game_url="http://chart.apis.google.com/chart?cht=qr&chs=250x250&chl="+game_code+"&chld=H|0";
  });
  
  var promise = $interval($scope.get_players, 2000);
  // Cancel interval on page changes
  $scope.$on('$destroy', function(){
      if (angular.isDefined(promise)) {
          $interval.cancel(promise);
          promise = undefined;
      }
  });


})
.controller('PlayerJoinGameCtrl',function($scope,$state,$rootScope,$ionicPopup,$cordovaBarcodeScanner,Game){
  
    $rootScope.user=$rootScope.user;
  
    $scope.scanBarcode = function() {
          $cordovaBarcodeScanner.scan().then(function(imageData) {
              $scope.user_data=$rootScope.user.name;
              $scope.scan_data=imageData.text;
              
              if($scope.scan_data.length > 10){
              
                  Game.join($scope.scan_data,$scope.user_data).then(function(data){
                    $rootScope.game_code = $scope.scan_data;
                    $state.go('player-waiting');
                  });
              
              }else{
                var alertPopup = $ionicPopup.alert({
                                        title: 'Error Scanning',
                                        template: '<p style="text-align:center;color:black;">Unsuccessful Scan! Scan to Join Game!</p>',
                                        buttons: [{
                                                    text: 'Okej!',
                                                    type: 'button-positive'
                                                    
                                                 }]
                                     });

                alertPopup.then(function(res) {
                    console.log('Unsuccessful scanning');
                });

              }


          }, function(error) {
              console.log(error);
          });
    };
})

.controller('PlayerGameCtrl',function($scope,$state,$rootScope,$cordovaBarcodeScanner,Game,$interval,$ionicGesture){
  
    $rootScope.user=$rootScope.user;

    //hardcoding game code
    $scope.game_code= $rootScope.game_code;
    
    $scope.wait_game_start=function(){

        Game.wait_game_start($scope.game_code).then(function(data){
            if(data==1){
                $state.go("player-hand");
            }            
        });

    }
    var promise = $interval($scope.wait_game_start, 2000);
    
    // Cancel interval on page changes
    $scope.$on('$destroy', function(){
        if (angular.isDefined(promise)) {
            $interval.cancel(promise);
            promise = undefined;
        }
    });

})

.controller('PlayerHandGameCtrl',function($scope,$state,$rootScope, Cards){
  
    $rootScope.user=$rootScope.user;
    $scope.cards = Cards.all();
    $scope.selected_card="";
    $scope.toogle_card_action=false;

    $scope.center_card_class="";
    $scope.toogleCardAction=function(){
      $scope.toogle_card_action=!$scope.toogle_card_action;
    }
    $scope.onSwipeDown=function(){
      $scope.swipe_events="down"; alert("down");
    }
    $scope.select_card=function(card){
      $scope.selected_card=card.image;
    }
    $scope.is_selected=function(card){
      return $scope.selected_card==card.image? "card_selected":"";
    }
    $scope.onSwipeUp=function(){
      //angular.element('#select_foto').trigger('click');
      //$('.center_card').addClass("SlideIn");
      //document.querySelector('.center_card').addClass("mmm");
      //angular.element(".center_card").addClass("SlideIn");
      $scope.center_card_class="slide-in";
    
      //alert("up");
    }

})

.controller('GameTableCtrl',function($scope,$state,$rootScope,Cards, Game, $ionicPopup, $timeout){
    
    $scope.toogle_card_action=false;

    $scope.card_ontouch_event=function(card){
      alert(card.className);
      //$scope.card_ontouch_event(this);

    }
    // easter eggs start

        

    $scope.startWinning=function  () {
        var $winningDeck = document.createElement('div')
        $winningDeck.classList.add('deck')
        $winningDeck.style[transform] = translate(Math.random() * window.innerWidth - window.innerWidth / 2 + 'px', Math.random() * window.innerHeight - window.innerHeight / 2 + 'px')
        $container.appendChild($winningDeck)

        var side = Math.floor(Math.random() * 2) ? 'front' : 'back'

        for (var i = 0; i < 55; i++) {
            $scope.addWinningCard($winningDeck, i, side)
        }

        setTimeout($scope.startWinning, Math.round(Math.random() * 1000))
    }

    $scope.addWinningCard=function ($deck, i, side) {
      var card = Deck.Card(54 - i)
      var delay = (55 - i) * 20
      var animationFrames = Deck.animationFrames
      var ease = Deck.ease

      card.enableFlipping()

      if (side === 'front') {
        card.setSide('front')
      } else {
        card.setSide('back')
      }

      card.mount($deck)
      card.$el.style.display = 'none'

      var xStart = 0
      var yStart = 0
      var xDiff = -500
      var yDiff = 500

      animationFrames(delay, 1000)
        .start(function () {
          card.x = 0
          card.y = 0
          card.$el.style.display = ''
        })
        .progress(function (t) {
          var tx = t
          var ty = ease.cubicIn(t)
          card.x = xStart + xDiff * tx
          card.y = yStart + yDiff * ty
          card.$el.style[transform] = translate(card.x + 'px', card.y + 'px')
        })
        .end(function () {
          card.unmount()
        })
    }
    $scope.mouse_move=function(){
      console.log("mouse move: ");
    }
    $scope.game_play=function(){
        
        var acesClicked = []
        var kingsClicked = []

        $scope.deck.cards.forEach(function (card, i) {
          
          card.enableDragging()
          //card.enableFlipping()

          card.$el.addEventListener('drag', onMouseMove);
          
          function onMouseMove(){
            console.log("mouse move");
          }
          //card.$el.addEventListener('touchstart', onTouch)
          
          Hammer(card.$el).on("doubletap", onDoubleTap);
          Hammer(card.$el).on("tap", onSingleTap);
          
          function onSingleTap(){
            $scope.toogle_card_action=!$scope.toogle_card_action;
            console.log("card tapped: "+card.i);

          }
          function onDoubleTap(){
            
            card.setSide(card.side=="front"? "back":"front");
            //console.log("card "+$scope.deck.cards.length);
            // $scope.deck.cards.splice($scope.deck.cards.indexOf(card),1);
            //console.log("card "+$scope.deck.cards.length);

          }
          function onTouch () {
            
            var card

            if (i % 13 === 0) {
              acesClicked[i] = true
              if (acesClicked.filter(function (ace) {
                return ace
              }).length === 4) {
                document.body.removeChild($topbar)
                $scope.deck.$el.style.display = 'none'
                setTimeout(function () {
                  startWinning()
                }, 250)
              }
            } else if (i % 13 === 12) {
              if (!kingsClicked) {
                return
              }
              kingsClicked[i] = true
              if (kingsClicked.filter(function (king) {
                return king
              }).length === 4) {
                for (var j = 0; j < 3; j++) {
                  card = Deck.Card(52 + j)
                  card.mount(deck.$el)
                  card.$el.style[transform] = 'scale(0)'
                  card.setSide('front')
                  card.enableDragging()
                  card.enableFlipping()
                  $scope.deck.cards.push(card)
                }
                $scope.deck.sort(true)
                kingsClicked = false
              }
            } else {
              acesClicked = []
              if (kingsClicked) {
                kingsClicked = []
              }
            }
          }
        })
    }

    $scope.initializeGame=function(){
        
        var prefix = Deck.prefix

        var transform = prefix('transform')

        var translate = Deck.translate

        var $container = document.getElementById('container')
        var $topbar = document.getElementById('topbar')
        var $usersbar = document.getElementById('usersbar');

        var $sort = document.createElement('button') 
        var $shuffle = document.createElement('button')
        var $bysuit = document.createElement('button')
        var $fan = document.createElement('button')
        var $poker = document.createElement('button')
        var $flip = document.createElement('button')

        var $user = document.createElement('img'); $user.className += 'user-avatar'; $user.src="http://www.marketplace.co.tz/data/photos/1343467347_ns.jpg";
        var $user2 = document.createElement('img'); $user2.className += 'user-avatar'; $user2.src="http://www.marketplace.co.tz/data/photos/1343467347_ns.jpg";
        
        // $user2.addEventListener('dragover', function () {
        //   alert(12);
        // })
        $usersbar.appendChild($user);
        $usersbar.appendChild($user2);
                          

        $shuffle.textContent = 'Shuffle'
        $sort.textContent = 'Sort'
        $bysuit.textContent = 'By suit'
        $fan.textContent = 'Fan'
        $poker.textContent = 'Poker'
        $flip.textContent = 'Flip'

        $topbar.appendChild($flip)
        $topbar.appendChild($shuffle)
        $topbar.appendChild($bysuit)
        $topbar.appendChild($fan)
        $topbar.appendChild($poker)
        $topbar.appendChild($sort)

        $scope.deck = Deck()

        $shuffle.addEventListener('click', function () {
          
          $scope.deck.shuffle()
          $scope.deck.shuffle()

        })
        $sort.addEventListener('click', function () {
          $scope.deck.sort()
        })
        $bysuit.addEventListener('click', function () {
          $scope.deck.sort(true) // sort reversed
          $scope.deck.bysuit()
        })
        $fan.addEventListener('click', function () {
          $scope.deck.fan()
        })
        $flip.addEventListener('click', function () {
          $scope.deck.flip()
        })

        $poker.addEventListener('click', function () {
          
          $scope.deck.queue(function (next) {
            $scope.deck.cards.forEach(function (card, i) {
              setTimeout(function () {
                card.setSide('back')
              }, i * 7.5)
            })
            next()
          })
          $scope.deck.shuffle()
          $scope.deck.shuffle()
          $scope.deck.poker()
        })

        $scope.deck.mount($container)

        //deck.intro()
        // deck.sort()

        $scope.game_play();

    }
    

    $scope.start_game=function(){
         $scope.initializeGame();
    }

    $scope.start_game();

})
.controller('TableGameCtrl',function($scope,$state,$rootScope, Cards, Game, $ionicPopup, $timeout){
  
    //$rootScope.user=$rootScope.user;
    $scope.cards = Cards.all();
    $scope.players = $rootScope.players;
    
    $scope.choosePlayer=function(){        

        var listPopup = $ionicPopup.show({
         template: '<ion-list>                                '+
                   '  <ion-item ng-repeat="player in players"> '+
                   '    {{player.name}}                              '+
                   '  </ion-item>                             '+
                   '</ion-list>                               ',
         
         title: 'Which player ?',
         scope: $scope,
         buttons: [
           { text: 'Cancel' },
         ]
        }); 
    }
});