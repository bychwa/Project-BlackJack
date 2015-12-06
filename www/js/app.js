angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
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
    controller: 'HomeCtrl'
  })

  .state('home-inviteusers', {
    url: '/home-inviteusers',
    templateUrl: 'templates/home-inviteusers.html',
    controller: 'MasterGameCtrl'
  })
  .state('home-acceptinvitation', {
    url: '/home-acceptinvitation',
    templateUrl: 'templates/home-acceptinvitation.html',
    controller: 'PlayerGameCtrl'
  })

  .state('player-waiting', {
    url: '/player-waiting',
    templateUrl: 'templates/player-waiting.html',
    controller: 'PlayerGameCtrl'
  })

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  $urlRouterProvider.otherwise('/home-usertype');

});
