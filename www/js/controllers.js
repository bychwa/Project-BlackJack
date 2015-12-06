angular.module('starter.controllers', ['ngCordova'])

.controller('HomeCtrl', function($scope,$rootScope, $state) {
    
    $rootScope.user=$rootScope.user;
    
    $scope.select_usertype=function(user){
      $rootScope.user=user;
      $state.go('home-username');
    }

    $scope.select_username=function(user){
      
        $rootScope.user=user;
        if($rootScope.user.type=='deck'){
          $state.go('home-inviteusers');
        }else{
          $state.go('home-acceptinvitation');
        }
    }

   

})
.controller('MasterGameCtrl', function($scope,$rootScope,$state,$interval,Game) {
 
  $rootScope.user=$rootScope.user;
  
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
      $scope.game_url="http://chart.apis.google.com/chart?cht=qr&chs=200x200&chl="+game_code+"&chld=H|0";
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
.controller('PlayerGameCtrl',function($scope,$rootScope,$cordovaBarcodeScanner,Game){
  
    $rootScope.user=$rootScope.user;
  
    $scope.scanBarcode = function() {
          $cordovaBarcodeScanner.scan().then(function(imageData) {
              //var post_data=[{'user':user_data,'code':imageData.text}];
              $scope.user_data=$rootScope.user.name;
              $scope.scan_data=imageData.text;

              Game.join($scope.scan_data,$scope.user_data).then(function(data){
                 //data.data.code; 
                 $state.go('player-waiting');
                
              });

          }, function(error) {
              console.log(error);
          });
    };
})
.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
 
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
