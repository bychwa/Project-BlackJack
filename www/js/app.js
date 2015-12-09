angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])

.run(function($ionicPlatform,$cordovaStatusbar) {


  $ionicPlatform.ready(function() {
      
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

    }
    
    ionic.Platform.fullScreen();
    if (window.StatusBar) {
      return StatusBar.hide();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('home-usertype', {
    url: '/home-usertype',
    templateUrl: 'templates/home-usertype.html',
    controller: 'HomeCtrl'
  })
  
  .state('home-username', {
    url: '/home-username',
    templateUrl: 'templates/home-username.html',
    controller: 'UsernameCtrl'
  })

  .state('home-inviteusers', {
    url: '/home-inviteusers',
    templateUrl: 'templates/home-inviteusers.html',
    controller: 'MasterGameCtrl'
  })
  .state('home-acceptinvitation', {
    url: '/home-acceptinvitation',
    templateUrl: 'templates/home-acceptinvitation.html',
    controller: 'PlayerJoinGameCtrl'
  })

  .state('player-waiting', {
    url: '/player-waiting',
    templateUrl: 'templates/player-waiting.html',
    controller: 'PlayerGameCtrl'
  })
  .state('player-hand', {
    url: '/player-hand',
    templateUrl: 'templates/player-hand.html',
    controller: 'PlayerHandGameCtrl'
  })

  .state('table', {
    url: '/table',
    templateUrl: 'templates/table.html',
    controller: 'TableGameCtrl'
  });

  $urlRouterProvider.otherwise('/player-hand');

});
