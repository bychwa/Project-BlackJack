angular.module('starter.controllers', ['ngCordova'])

.controller('HomeCtrl', function($scope,$rootScope, $state /*,$cordovaDevice*/) {
    
    //$scope.uuid = $cordovaDevice.getUUID();
    
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
  $scope.get_players=function(){
      Game.players($scope.game_code).then(function(data){
        $scope.players=data; 
        console.log(data);
      });
  }
  $scope.start_game=function(){
    console.log('start the game');
  }


  Game.new().then(function(game_code){
      $scope.game_code=game_code;
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
.controller('PlayerJoinGameCtrl',function($scope,$state,$rootScope,$cordovaBarcodeScanner,Game){
  
    $rootScope.user=$rootScope.user;
  
    $scope.scanBarcode = function() {
          $cordovaBarcodeScanner.scan().then(function(imageData) {
              $scope.user_data=$rootScope.user.name;
              $scope.scan_data=imageData.text;

              Game.join($scope.scan_data,$scope.user_data).then(function(data){
             
                 $state.go('player-hand');
                
              });

          }, function(error) {
              console.log(error);
          });
    };
})

.controller('PlayerGameCtrl',function($scope,$state,$rootScope,$cordovaBarcodeScanner,Game,$ionicGesture){
  
    $rootScope.user=$rootScope.user;
    
})

.controller('PlayerHandGameCtrl',function($scope,$state,$rootScope, Cards){
  
    $rootScope.user=$rootScope.user;
    $scope.cards = Cards.all();
    $scope.selected_card="";
    $scope.toogle_card_action=false;
    

    $scope.toogleCardAction=function(){
      $scope.toogle_card_action=!$scope.toogle_card_action;
    }
    $scope.onSwipeDown=function(){
      $scope.swipe_events="down"; alert("down");
    }
    $scope.select_card=function(card){
      $scope.selected_card=card.image;
    }

});
