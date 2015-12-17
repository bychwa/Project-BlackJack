angular.module('starter.controllers', ['ngCordova'])

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
        $state.go('table');
    
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