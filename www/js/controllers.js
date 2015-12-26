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
    $scope.go_to_debugView=function(){
        $state.go('all-views');
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
 
  $scope.user=$rootScope.user;
  $scope.players=[];
  //$rootScope.players=$scope.players;
  $scope.get_players=function(){
      Game.players($scope.game_code).then(function(data){
        $scope.players=data; 
        $rootScope.players=$scope.players;
      });
  }
  $scope.start_game=function(){
    
    console.log('start the game');
    Game.start_game($scope.game_code).then(function(data){
        
        $rootScope.game_code=$scope.game_code;

        console.log('game started!');
        
        $state.go('game-table');
    
    });

  }


  Game.new().then(function(game_code){
      $scope.game_code=game_code;
      $rootScope.game_code=game_code;
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
  
    $scope.user=$rootScope.user;
  
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

.controller('PlayerHandGameCtrl',function($scope,$state,$rootScope,Cards,Game,$interval){

    $scope.user = $rootScope.user;
    $scope.game_code = $rootScope.game_code;
    
    // $scope.cards = Cards.all();

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

    $scope.card_maping=function(card){
        return Cards.map(card);
    }
    $scope.fetch_cards=function(){
        
        Game.fetch_cards($scope.game_code,$scope.user.name).then(function(data){
            $scope.playercards=data;            
        });
    }
    var promise = $interval($scope.fetch_cards, 2000);
    
    // Cancel interval on page changes
    $scope.$on('$destroy', function(){
        if (angular.isDefined(promise)) {
            $interval.cancel(promise);
            promise = undefined;
        }
    });

})

.controller('GameTableCtrl',function($scope,$state,$rootScope, Cards, Game,$q, $ionicPopup, $timeout){
    
    $scope.game_code =$rootScope.game_code;
    console.log("game code: "+$scope.game_code);

    $scope.Settings = {};
    $scope.players = $rootScope.players; 
    
    // console.log($rootScope.players);

    $scope.toogle_card_action=false;
    
    $scope.pressed_card=null;

    $scope.shuffle_cards=function(){
        
        $scope.deck.shuffle();
        $scope.deck.shuffle();
        $scope.deck.shuffle();
        $scope.deck.shuffle();
        
    }
    $scope.close_popup=function(popup){
        popup.close();
    }
    $scope.serve_a_player=function(player,popup){
      
      alert("player "+player.name+" served a card "+$scope.pressed_card.i);
      
      $scope.togle_visibility("game_menu","hide");
      $scope.togle_visibility("player_menu","hide");    
      popup.close();

    }

    $scope.serve_card=function(){

        $scope.serveCardPopup = $ionicPopup.show({
                                  title:"Pick a Player to serve!",  
                                  template:'<div style="text-align:center;" ng-if="!players">--No Players!--</div><a class="button button-bar button-primary" style="text-align:center;" ng-if="!players" ng-click="close_popup(serveCardPopup)"> close </a><div class="list"><a ng-repeat="player in players" class="item" style="text-align:center;" ng-click="serve_a_player(player,distributePopup)" href="#"> {{ player.name }} </a></div>',
                                  scope:$scope,
                                });

        $scope.serveCardPopup.then(function(res) {
            
              console.log(res);  

        });

    }
    $scope.distribute_cards=function(){
        var distributePopup = $ionicPopup.show({
                                  template: '<input type="number" ng-model="Settings.distribution_no"/>',
                                  title: 'Enter Distribution number!',
                                  subTitle: 'Please enter 0 if you dont want to distribute!',
                                  scope:$scope,
                                  buttons: [
                                    { text: 'Cancel' },
                                    {
                                      text: '<b>Distribute</b>',
                                      type: 'button-positive',
                                      onTap: function(e) {
                                        if (!$scope.Settings.distribution_no) {
                                          e.preventDefault();
                                        } else {
                                          return $scope.Settings.distribution_no;
                                        }
                                      }
                                    }
                                  ]
                                });

        distributePopup.then(function(res) {
              
              var distribution_no=res;
              
              if($scope.deck.cards.length < (distribution_no * $scope.players.length)){
                  alert("Your distribution is more than the posiblity! Try again with fewer distribution number!");

              }else{

                    var cards=[];
                    for (var i=0; i < $scope.players.length; i++) {
                        for (var j=0; j < distribution_no; j++) {
                              cards.push([$scope.game_code,$scope.players[i].name,$scope.deck.cards[0].i]);
                              $scope.card_remove($scope.deck.cards[0]);
                            
                        };    
                    };
                    Game.distribute(cards).then(function(data){
                          console.log(data);
                    }); 


              }
             
        });
            
    }

    $scope.menu_click_event=function(menu,button){
        switch(menu){
          case 'player':
                switch(button){
                  case 'game_menu':
                        $scope.togle_visibility("player_menu","hide");    
                        $scope.togle_visibility("game_menu","show");    
                        console.log(button);
                      break;
                  case 'exit':
                        $scope.togle_visibility("game_menu","hide");
                        $scope.togle_visibility("player_menu","hide");    
                        console.log(button);
                      break;
                  default:

                    break;   
                }
              break;
          case 'game':
               switch(button){
                  case 'exit':
                        $scope.togle_visibility("game_menu","hide");
                        $scope.togle_visibility("player_menu","hide");    
                        console.log(button);
                      break;
                  case 'card_menu':  
                        $scope.togle_visibility("game_menu","hide");    
                        $scope.togle_visibility("player_menu","show");    
                      break;  
                  default:

                    break;   
                }
              break;     

          default:
            break;    
        }   
    }

    // $scope.startWinning=function  () {
    //     var $winningDeck = document.createElement('div')
    //     $winningDeck.classList.add('deck')
    //     $winningDeck.style[transform] = translate(Math.random() * window.innerWidth - window.innerWidth / 2 + 'px', Math.random() * window.innerHeight - window.innerHeight / 2 + 'px')
    //     $container.appendChild($winningDeck)
    //     var side = Math.floor(Math.random() * 2) ? 'front' : 'back'
    //     for (var i = 0; i < 55; i++) {
    //         $scope.addWinningCard($winningDeck, i, side)
    //     }
    //     setTimeout($scope.startWinning, Math.round(Math.random() * 1000))
    // }

    // $scope.addWinningCard=function ($deck, i, side) {
    //   var card = Deck.Card(54 - i)
    //   var delay = (55 - i) * 20
    //   var animationFrames = Deck.animationFrames
    //   var ease = Deck.ease

    //   card.enableFlipping()

    //   if (side === 'front') {
    //     card.setSide('front')
    //   } else {
    //     card.setSide('back')
    //   }

    //   card.mount($deck)
    //   card.$el.style.display = 'none'

    //   var xStart = 0
    //   var yStart = 0
    //   var xDiff = -500
    //   var yDiff = 500

    //   animationFrames(delay, 1000)
    //     .start(function () {
    //       card.x = 0
    //       card.y = 0
    //       card.$el.style.display = ''
    //     })
    //     .progress(function (t) {
    //       var tx = t
    //       var ty = ease.cubicIn(t)
    //       card.x = xStart + xDiff * tx
    //       card.y = yStart + yDiff * ty
    //       card.$el.style[transform] = translate(card.x + 'px', card.y + 'px')
    //     })
    //     .end(function () {
    //       card.unmount()
    //     })
    // }

    $scope.togle_visibility=function(item,property){
        var x = document.getElementById(item).className;
         
        if(property=="hide"){
            if(x.indexOf("hidden") <= -1){
              document.getElementById(item).className +=" hidden";
            }
        }else{
          if(x.indexOf("hidden") > -1){
            document.getElementById(item).className -=" hidden";
          }
        }
    }

    $scope.card_doubletapped=function(card){
        $scope.doubletapped_card=card;
        card.setSide(card.side=="front" ? "back":"front");
    }
    $scope.card_pressed=function(card){
        $scope.pressed_card=card;
        $scope.togle_visibility("player_menu","show");
        $scope.togle_visibility("game_menu","hide");
    }
    $scope.card_remove=function(card){
        card.$el.className += " hidden";         
        $scope.deck.cards.splice($scope.deck.cards.indexOf(card),1);
            
    }
    $scope.game_play=function(){
        
        var acesClicked = []
        var kingsClicked = []

        $scope.deck.cards.forEach(function (card, i) {
          
          card.enableDragging()
          //card.enableFlipping()
          
          Hammer(card.$el).on("doubletap", onDoubleTap);
          Hammer(card.$el).on("press", onPress);

          function onPress(){
             $scope.card_pressed(card);
          }
          
          function onDoubleTap(){
               $scope.card_doubletapped(card);
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
          });
      
    }
    
    $scope.initializeGame=function(){
        
        var prefix = Deck.prefix
        var transform = prefix('transform')
        var translate = Deck.translate

        var $container = document.getElementById('container')
        
        var $sort = document.createElement('button') 
        var $shuffle = document.createElement('button')
        var $bysuit = document.createElement('button')
        var $fan = document.createElement('button')
        var $poker = document.createElement('button')
        var $flip = document.createElement('button')

        $shuffle.textContent = 'Shuffle'
        $sort.textContent = 'Sort'
        $bysuit.textContent = 'By suit'
        $fan.textContent = 'Fan'
        $poker.textContent = 'Poker'
        $flip.textContent = 'Flip'

        // $topbar.appendChild($flip)
        // $topbar.appendChild($shuffle)
        // $topbar.appendChild($bysuit)
        // $topbar.appendChild($fan)
        // $topbar.appendChild($poker)
        // $topbar.appendChild($sort)

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

        // deck.intro()
        // deck.sort()

         $scope.game_play();

    }
    
    $scope.start_game=function(){
        $scope.initializeGame();
    }

    $scope.start_game();

})

.controller('AllViewsCtrl', function($scope,$rootScope, $state) {
    $scope.views = ["Home-AcceptInvitation", "Home-InviteUsers", "Home-Username", "Home-Usertype",
                    "Player-Hand", "Player-Waiting", "Table", "Game-Table", "Options"];
    $scope.get_views=function(){
      return 0;
    };
})

.controller('OptionsCtrl', function($scope,$rootScope, $state) {
    // TODO: Add functions here

    $rootScope.debug=function(stringToDebug){
          console.log("OptionsCtrl called!");  
          console.log("OptionsCtrl: " + stringToDebug); 
    };
    $scope.$on("$ionicView.beforeEnter", function() {
        console.log("Options is entering!");  
    });
})

.controller('TableCtrl', function($scope, $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/options.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })  

  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
})

.controller('ModalCtrl', function($scope, $ionicModal) {
  $scope.contact = {
    name: 'Mittens Cat',
    info: 'Tap anywhere on the card to open the modal'
  }

  $ionicModal.fromTemplateUrl('contact-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal
  })  

  $scope.openModal = function() {
    $scope.modal.show()
  }

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
});