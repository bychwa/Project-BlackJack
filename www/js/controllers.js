angular.module('starter.controllers', ['ngCordova','ionic-toast','ng-walkthrough'])

.controller('HomeCtrl', function($scope,$rootScope,$ionicPlatform,ionicToast,$state,$localstorage,$timeout /*,$cordovaDevice*/) {
    
    console.log('scope for usertype-before',$scope);
    
    $localstorage.set('User',"");
    $localstorage.set('Game',"");

    $scope.click=function(){
      
    }
    
    $scope.select_usertype=function(user){

      $localstorage.setObject('User',{ usertype:user.type});
      
      if(user.type=='deck'){
          $state.go('home-inviteusers');
          console.log('scope for usertype-after',$scope);
    
        }else{
          $state.go('home-username');
          console.log('scope for usertype-after',$scope);
    
        }
    }

  })

.controller('UsernameCtrl', function($scope,$rootScope,$localstorage, $state) {
    console.log('scope for username-before',$scope);
    
    $scope.user = $localstorage.getObject('User');
    $scope.select_username=function(user){
      
        $scope.user.name=user.name;
        $localstorage.setObject('User',$scope.user);
        $state.go('home-acceptinvitation');
        console.log('scope for username-after',$scope);
    
    }

})
.controller('MasterGameCtrl', function($scope,$rootScope,$localstorage,ionicToast, $state,$interval,Game) {
  
  console.log('scope for inviteusers-before',$scope);
    
  $scope.user=$localstorage.getObject('User');
  
  $scope.Game={};
  $scope.Game.players=[];
  $scope.Game.code="";

  $scope.get_players=function(){
      Game.players($scope.Game.code).then(function(data){
          if($scope.Game.players.length!=data.length){
             ionicToast.show("Success! New player joined!", 'bottom', false, 2000);
          }
          $scope.Game.players=data; 
          $localstorage.setObject('Game',$scope.Game);
      });
  }
  $scope.start_game=function(){
    
    console.log('start the game');

    Game.start_game($scope.Game.code).then(function(data){

        console.log('game started!');
        $state.go('game-table');
        console.log('scope for inviteusers-after',$scope);
    
    });

  }


  Game.new().then(function(game_code){
      
      $localstorage.setObject('Game',{ code: game_code});

      $scope.Game.code=game_code;
      
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
.controller('PlayerJoinGameCtrl',function($scope,$state,$localstorage,ionicToast, $rootScope,$ionicPopup,$cordovaBarcodeScanner,Game){
    console.log('scope for acceptinvitation-before',$scope);
    
    $scope.user={};
    $scope.user=$localstorage.getObject('User');
    
    $scope.Game={};
    $scope.Game=$localstorage.getObject('Game');
    
    $scope.scanBarcode = function() {

          $cordovaBarcodeScanner.scan().then(function(imageData) {
              
              $scope.Game.code=imageData.text;

              if($scope.Game.code.length > 10){
                  Game.join($scope.Game.code,$scope.user.name).then(function(data){
                      
                      $localstorage.setObject('Game',$scope.Game);

                      $state.go('player-waiting');
                      console.log('scope for acceptinvitation-after',$scope);

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

.controller('PlayerGameCtrl',function($scope,$state,$rootScope,ionicToast,$localstorage,$cordovaBarcodeScanner,Game,$interval,$ionicGesture){
    console.log('scope for waitgame-before',$scope);
    $scope.game_status=0;

    $scope.user={};
    $scope.user=$localstorage.getObject('User');
    
    $scope.Game={};
    $scope.Game=$localstorage.getObject('Game');
    
    $scope.wait_game_start=function(){
        
        Game.wait_game_start($scope.Game.code).then(function(data){
            $scope.game_status=data.game_state;
            
            if(data.success){
                if(data.game_state==1){
                      $state.go("player-hand");
                      console.log('scope for waitgame-after',$scope);
          
                }else{
                  //game hasnt started


                }   
                
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

.controller('PlayerHandGameCtrl',function($scope,$state,$localstorage, ionicToast, $rootScope,Cards,Game,$interval){
    
    console.log('scope for playerhand-before',$scope);
    
    $scope.user={};
    $scope.user=$localstorage.getObject('User');
    
    $scope.Game={};
    $scope.Game=$localstorage.getObject('Game');
    $scope.Game.Hand={};

    $scope.Game.Hand.selected_card=Cards.back();
    $scope.Game.Hand.toogle_card_action=false;

    $scope.Game.Hand.center_card_class="";

    $scope.hide_walkthrough=function(number){
        $scope.walkthrough_one=false;
        $scope.walkthrough_two=false;
        $scope.walkthrough_three=false;
        switch(number){
            case 1: $scope.walkthrough_two=true; break;
            case 2: $scope.walkthrough_three=true; break;
        }
    }
    $scope.show_walkthrough=function(){
        
        $scope.walkthrough_one=true;

    }
    $scope.toogleCardAction=function(){
      if($scope.Game.Hand.selected_card.id!=52){
        $scope.Game.Hand.toogle_card_action=!$scope.Game.Hand.toogle_card_action;
      }
      
    }
    $scope.onSwipeDown=function(){
      $scope.swipe_events="down"; alert("down");
    }
    $scope.select_card=function(card){
      $scope.Game.Hand.selected_card=card;
    }
    $scope.is_selected=function(card){
      return $scope.Game.Hand.selected_card==card.image? "card_selected":"";
    }
    $scope.play_a_card=function(){
      
      $scope.Game.Hand.center_card_class="slide-out";

      Game.play_a_card($scope.Game.code,$scope.user.name,$scope.Game.Hand.selected_card.id).then(function(data){
            
            if(data.success){

                ionicToast.show("Player "+$scope.user.name+" was successfully served a card ", 'bottom', false, 2500);
                
                $scope.Game.Hand.center_card_class="";
                $scope.Game.Hand.selected_card=Cards.back();

            }else{

                ionicToast.show("Error! Player "+$scope.user.name+" was not successfully served a card ", 'bottom', false, 2500);
                
            }

        },function(error){
            
            // ionicToast.show("Error! Player "+$scope.user.name+" card:"+$scope.Game.Hand.selected_card+" code:"+$scope.Game.code, 'bottom', true, 2500);
            console.log(error);
            
        });
    }

    $scope.card_maping=function(card){
        return Cards.map(card);
    }
    $scope.fetch_cards=function(){
        
        Game.fetch_cards($scope.Game.code,$scope.user.name).then(function(data){
            if($scope.Game.Hand.playercards){

              if($scope.Game.Hand.playercards.length!=data.length){
                ionicToast.show("Success! New card received!", 'top', false, 2500);
              }
              $scope.Game.Hand.playercards=data;
            }else{
              $scope.Game.Hand.playercards=data;

            }
            
            console.log('scope for playerhand-loop',$scope);
                
        });

    }
    var promise = $interval($scope.fetch_cards, 1000);
    
    // Cancel interval on page changes
    $scope.$on('$destroy', function(){
        if (angular.isDefined(promise)) {
            $interval.cancel(promise);
            promise = undefined;
        }
    });

})

.controller('GameTableCtrl',function($scope,$state,$localstorage,$ionicModal, $rootScope,ionicToast, Cards,Backgrounds,Game,$q, $interval, $ionicPopup, $timeout){
    
    $scope.user=$localstorage.getObject('User');
    $scope.Game=$localstorage.getObject('Game');
    $scope.Game.Table={};
    $scope.Game.Settings={};
    $scope.Game.Table.deckcards=[];
    $scope.Game.scores={};

    $scope.Game.Table.toogle_card_action=false;
    $scope.Game.Table.pressed_card=null;
    
    $scope.Game.Table.card_background={};

    $scope.backgrounds = Backgrounds.all();
    

    $scope.set_card_background=function(){
        var el = document.querySelectorAll(".bj_card .back");
        for (i = 0; i < el.length; i++) {
            el[i].style.backgroundImage="url('"+$scope.Game.Table.card_background.src+"')";
        }
    }
    $scope.select_background=function(back){
        $scope.Game.Table.card_background=back;
        var el = document.querySelectorAll(".bj_card .back");
        for (i = 0; i < el.length; i++) {
            el[i].style.backgroundImage="url('"+$scope.Game.Table.card_background.src+"')";
        }
    }
    $scope.background_selected=function(id){

        if($scope.Game.Table.card_background.id==id){
          return "back_selected";
        }
        return "";
    }

    $scope.player_score=function(player){
        var total = parseInt(player.score.round_1) + parseInt(player.score.round_2) + parseInt(player.score.round_3) + parseInt(player.score.round_4) + parseInt(player.score.round_5);
        return total;
    }

    $scope.top_scorer=function(players){
      
        var max=0; var top=0; var score_sheet=[];
        
        players.forEach(function(player,i){
            var total = parseInt(player.score.round_1)+ parseInt(player.score.round_2)+ parseInt(player.score.round_3)+ parseInt(player.score.round_4)+ parseInt(player.score.round_5);
            score_sheet.push({name:player.name, score:total });

        });
        
        for (var i = 0; i < score_sheet.length; i++) {
            
            if(max < score_sheet[i].score){
                max=score_sheet[i].score;
                top=i;
            }

        };
        return score_sheet[top];

    };

    $scope.fetch_cards=function(){
        
        function deck_contains_card(deck,card){
            for (var i = deck.length - 1; i >= 0; i--) {
                if(deck[i].i==card.i){
                  return true;
                }
            }
            return false;
        }
        Game.fetch_cards($scope.Game.code,"deck").then(function(deckcards){
            
              $scope.container = document.getElementById('tabledeck');
                
                var deck=[];

                deckcards.forEach(function (dc, i) {
                    
                    var card=Deck().cards[dc.card];
                    
                    card.enableDragging();
                    
                    Hammer(card.$el).on("doubletap", onDoubleTap);
                    Hammer(card.$el).on("press", onPress);

                    function onPress(){
                       $scope.card_pressed(card);
                    }
                    
                    function onDoubleTap(){
                         $scope.card_doubletapped(card);
                    }
                    deck.push(card);

                });

              if(deck.length!=$scope.Game.Table.deckcards.length){
              
                  for (var i = 0; i < deck.length; i++) {
                      
                      var dc = deck[i];

                      if(!deck_contains_card($scope.Game.Table.deckcards,dc)){

                            dc.setSide("front");                            
                            dc.mount($scope.container);
                            $scope.Game.Table.deckcards.push(dc);
                            console.log('gameactivity','card '+dc.i+' added to the deck');  
                      }


                  }
              }
        });

    };
    
    $scope.shuffle_cards=function(){
        
        $scope.deck.shuffle();
        $scope.deck.shuffle();
        $scope.deck.shuffle();
        $scope.deck.shuffle();
        ionicToast.show("Shuffling cards!!", 'bottom', false, 2500);
           
    };
    $scope.close_popup=function(popup){
        popup.close();

    };
    $scope.serve_a_player=function(player,popup){
      
        Game.serve_a_card($scope.Game.code,player.name,$scope.Game.Table.pressed_card.i).then(function(data){
            
            if(data.success){
                
                $scope.card_remove($scope.Game.Table.pressed_card);

                ionicToast.show("Player "+player.name+" was successfully served a card ", 'bottom', false, 2500);
                
                $scope.togle_visibility("game_menu","hide");
                $scope.togle_visibility("player_menu","hide");  
                popup.close();

            }else{

                ionicToast.show("Error! Player "+player.name+" was not successfully served a card ", 'bottom', false, 2500);
                popup.close();

            }
            
        },function(error){
            console.log(error);
            ionicToast.show(error, 'bottom', false, 2500);
            popup.close();

        });

    };

    $scope.serve_card=function(){
        
        $scope.serveCardPopup="";

        $scope.serveCardPopup = $ionicPopup.show({
                                  title:"Pick a Player to serve!",  
                                  template:'<div style="text-align:center;" ng-if="!Game.players">--No Players!-- <hr/> </div><a class="button button-bar button-primary" style="text-align:center;" ng-if="!Game.players" ng-click="close_popup(serveCardPopup)"> close </a><div class="list"><a ng-repeat="player in Game.players" class="item" style="text-align:center;" ng-click="serve_a_player(player,serveCardPopup)" href="#"> {{ player.name }} </a><hr/><a class="button button-bar button-assertive" ng-click="close_popup(serveCardPopup)"> Exit </a></div>',
                                  scope:$scope,
                                });

        $scope.serveCardPopup.then(function(res) {
              $scope.serveCardPopup.close();
              console.log(res);  

        });

    };
    $scope.distribute_cards=function(){
        var distributePopup = $ionicPopup.show({
                                  template: '<input type="number" ng-model="Game.Table.distribution_size"/>',
                                  title: 'Enter Distribution number!',
                                  subTitle: 'Please enter 0 if you dont want to distribute!',
                                  scope:$scope,
                                  buttons: [
                                    { text: 'Cancel' },
                                    {
                                      text: '<b>Distribute</b>',
                                      type: 'button-positive',
                                      onTap: function(e) {
                                        if (!$scope.Game.Table.distribution_size) {
                                          e.preventDefault();
                                        } else {
                                          return $scope.Game.Table.distribution_size;
                                        }
                                      }
                                    }
                                  ]
                                });

            distributePopup.then(function(res) {
              
              $scope.Game.Table.distribution_size=res;
              
              if($scope.deck.cards.length < ($scope.Game.Table.distribution_size * $scope.Game.players.length)){
                  alert("Your distribution is more than the posiblity! Try again with fewer distribution number!");

              }else{

                  var cards=[];
                  for (var i=0; i < $scope.Game.players.length; i++) {
                      for (var j=0; j < $scope.Game.Table.distribution_size; j++) {
                            cards.push([$scope.Game.code,$scope.Game.players[i].name,$scope.deck.cards[0].i]);
                            $scope.card_remove($scope.deck.cards[0]);
                          
                      };
                      ionicToast.show("Success!"+$scope.Game.Table.distribution_size+" cards given to "+$scope.Game.code,$scope.Game.players[i].name, 'bottom', false, 2500);
           
                  };
                  Game.distribute(cards).then(function(data){
                        console.log(data);
                        ionicToast.show("Success! Cards successfully distributed!", 'bottom', false, 2500);
           
                  }); 

              }
             
        });
            
    };

    $scope.menu_click_event=function(menu,button){
        switch(menu){
          case 'player':
                switch(button){
                  case 'game_menu':
                        $scope.togle_visibility("player_menu","hide");    
                        $scope.togle_visibility("game_menu","show");    
                        
                      break;
                  case 'exit':
                        $scope.togle_visibility("game_menu","hide");
                        $scope.togle_visibility("player_menu","hide");    
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
    };

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
    };

    $scope.card_doubletapped=function(card){
        $scope.Game.Table.doubletapped_card=card;
        card.setSide(card.side=="front" ? "back":"front");
    };
    $scope.card_pressed=function(card){
        $scope.Game.Table.pressed_card=card;
        $scope.togle_visibility("player_menu","show");
        $scope.togle_visibility("game_menu","hide");
    };
    $scope.card_remove=function(card){
        card.$el.className += " hidden";         
        $scope.deck.cards.splice($scope.deck.cards.indexOf(card),1);
            
    };
    $scope.game_play=function(){

        $scope.deck.cards.forEach(function (card, i) {
          
            card.enableDragging()
            
            Hammer(card.$el).on("doubletap", onDoubleTap);
            Hammer(card.$el).on("press", onPress);

            function onPress(){
               $scope.card_pressed(card);
            }
            
            function onDoubleTap(){
                 $scope.card_doubletapped(card);
            }
        });
        
        $scope.select_background($scope.backgrounds[0]);

      
    };

    $ionicModal.fromTemplateUrl('templates/game-score.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.scoremodal = modal;
      });
    $ionicModal.fromTemplateUrl('templates/game-options.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.optionsmodal = modal;
      });  
    $scope.openModal = function(modal) {
        modal.show();
    };
    $scope.closeModal = function(modal) {
        modal.hide();
    };

    $scope.score_game=function(){
        $scope.openModal($scope.scoremodal);
        $scope.pausePopup.close();
    };

    $scope.game_options=function(){
        $scope.openModal($scope.optionsmodal);
        $scope.pausePopup.close();
    };

    $scope.initializeGame=function(){
        
        var prefix = Deck.prefix;
        var transform = prefix('transform');
        var translate = Deck.translate;

        var $container = document.getElementById('container');

        $scope.deck = Deck($scope.Game.Settings.jokers,$scope.Game.Settings.number_of_deck);

        $scope.deck.mount($container);
        $scope.deck.flip();
        $scope.deck.flip();
        $scope.game_play();

    };
    $scope.resume_game=function(){
      $scope.pausePopup.close();
    };
    $scope.restart_game=function(){

        Game.restart_game($scope.Game.code).then(function(data){
            var tabledeck = document.getElementById('tabledeck');
              
            $scope.pausePopup.close();
            
            while (tabledeck.firstChild) {
                tabledeck.removeChild(tabledeck.firstChild);
            }
            
            $scope.set_card_background();

            $scope.deck.unmount();
            $scope.start_game();
            $scope.shuffle_cards();

        });

    }
    $scope.hide_walkthrough=function(number){
        $scope.walkthrough_one=false;
        $scope.walkthrough_two=false;
        $scope.walkthrough_three=false;
        $scope.walkthrough_four=false;
        $scope.walkthrough_five=false;
        $scope.walkthrough_six=false;
        $scope.walkthrough_seven=false;
        $scope.walkthrough_eight=false;
        $scope.walkthrough_nine=false;

        switch(number){
            case 1: $scope.walkthrough_two=true; break;
            case 2: $scope.walkthrough_three=true; break;
            case 3: $scope.walkthrough_four=true; break;
            case 4: $scope.walkthrough_five=true; break;
            case 5: $scope.walkthrough_six=true; break;
            case 6: $scope.walkthrough_seven=true; break;
            case 7: $scope.walkthrough_eight=true; break;
            case 8: $scope.walkthrough_nine=true; break;
        }

    }
    $scope.show_walkthrough=function(){
        
        $scope.walkthrough_index=1;

        $scope.walkthrough_one=true;
        
        $scope.game_hints="Game hints to come here!"; 

        $scope.pausePopup.close();
             
       
    }
    $scope.quit_game=function(){
        if(confirm("Are you Sure you want to Quit this game?")){
            $scope.pausePopup.close();
            $state.go('home-usertype');  
        }
        

    }

    $scope.pause_game=function(){
        $scope.pausePopup="";

        $scope.pausePopup = $ionicPopup.show({
                                  title:"<h3>Game Paused!!</h3><hr/>",  
                                  template:'<div class="button-bar button button-dark option-button" ng-click="resume_game()" style="text-align:center;">Resume</div><hr/><div class="button-bar button button-dark option-button" ng-click="restart_game()">Restart</div><hr/><div class="button-bar button button-dark option-button" ng-click="game_options()">Options</div><hr/><div class="button-bar button button-dark option-button" ng-click="score_game()">Score</div><hr/><div class="button-bar button button-dark option-button" ng-click="show_walkthrough()">Instruction</div><hr/><div class="button-bar button button-dark option-button text-center" ng-click="quit_game()">Quit</div>',
                                  scope:$scope,
                                });

        $scope.pausePopup.then(function(res) {
              $scope.pausePopup.close();
              console.log(res);  

        });

    }
    
    $scope.start_game=function(){
        $scope.initializeGame();
        console.log($scope.deck.cards);
    
    };

    $scope.get_players=function(){
        Game.players($scope.Game.code).then(function(data){
            if($scope.Game.players.length!=data.length){
               ionicToast.show("Success! New player joined!", 'bottom', false, 2000);
            }
            
            $scope.Game.players=data;
            $localstorage.setObject('Game',$scope.Game);
        });
    }

    $scope.start_game();

    var promise = $interval($scope.fetch_cards, 1000);
    
    $scope.$on('$destroy', function(){
        if (angular.isDefined(promise)) {
            $interval.cancel(promise);
            promise = undefined;
        }
       
    });


});
