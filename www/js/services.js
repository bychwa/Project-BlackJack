angular.module('starter.services', [])

.factory('Game', function($http,$q) {
  
  //var game = $http.get('http://api.bawalab.com/blackjack/new_game');
  
  return {
    new: function() {
        var deferred = $q.defer();
            $http.get('http://api.bawalab.com/blackjack/new_game').then(
                      function(data){
                        deferred.resolve(data.data.code);
                    },
                    function(error){
                        deferred.reject(error);
                    });
        return deferred.promise;
      },
    restart_game: function(code) {
          var deferred = $q.defer();
              $http.get('http://api.bawalab.com/blackjack/restart_game?code='+code).then(
                        function(data){
                          deferred.resolve(data.data);
                      },
                      function(error){
                          deferred.reject(error);
                      });
          return deferred.promise;
        },  
    start_game: function(code) {
          var deferred = $q.defer();
              $http.get('http://api.bawalab.com/blackjack/start_game?code='+code).then(
                        function(data){
                          deferred.resolve(data.data);
                      },
                      function(error){
                          deferred.reject(error);
                      });
          return deferred.promise;
        },
        
    wait_game_start: function(code) {
          var deferred = $q.defer();
              $http.get('http://api.bawalab.com/blackjack/wait_game_start?code='+code).then(
                        function(data){
                          deferred.resolve(data.data);
                      },
                      function(error){
                          deferred.reject(error);
                      });
          return deferred.promise;
        },  
    players: function(code) {
          var deferred = $q.defer();
              $http.get('http://api.bawalab.com/blackjack/list_players?code='+code).then(
                        function(data){
                          deferred.resolve(data.data);
                      },
                      function(error){
                          deferred.reject(error);
                      });
          return deferred.promise;
        },  
    join: function(scan,name) {
        var deferred = $q.defer();
            $http.get('http://api.bawalab.com/blackjack/join_game?code='+scan+'&player='+name).then(
                      function(data){
                        deferred.resolve(data.data);
                    },
                    function(error){
                        deferred.reject(error);
                    });

        return deferred.promise;
      },
    distribute: function(cards) {
        var deferred = $q.defer();
            $http.get('http://api.bawalab.com/blackjack/distribute?cards='+JSON.stringify(cards)).then(
                      function(data){
                        deferred.resolve(data.data);
                    },
                    function(error){
                        deferred.reject(error);
                    });
        return deferred.promise;
      },
    serve_a_card: function(code,player,card) {
        var deferred = $q.defer();
            $http.get('http://api.bawalab.com/blackjack/serve_card?card='+card+"&code="+code+"&player="+player).then(
                      function(data){
                        deferred.resolve(data.data);
                    },
                    function(error){
                        deferred.reject(error);
                    });
        return deferred.promise;
    }, 
    play_a_card: function(code,player,card) {
        var deferred = $q.defer();
            $http.get('http://api.bawalab.com/blackjack/play_a_card?card='+card+"&code="+code+"&player="+player).then(
                      function(data){
                        deferred.resolve(data.data);
                    },
                    function(error){
                        deferred.reject(error);
                    });
        return deferred.promise;
    }, 
    fetch_cards: function(code,player) {
        var deferred = $q.defer();
            $http.get('http://api.bawalab.com/blackjack/fetch_cards?player='+player+'&code='+code).then(
                      function(data){
                        deferred.resolve(data.data);
                    },
                    function(error){
                        deferred.reject(error);
                    });
        return deferred.promise;
      },      
  };
})

.factory('Cards', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var cards = [{
                id: 0,
                image: 'cards/ace_of_spades.png'
              }, {
                id: 1,
                image: 'cards/2_of_spades.png'
              }, {
                id: 2,
                image: 'cards/3_of_spades.png'
              }, {
                id: 3,
                image: 'cards/4_of_spades.png'
              }, {
                id: 4,
                image: 'cards/5_of_spades.png'
              }, {
                id: 5,
                image: 'cards/6_of_spades.png'
              }, {
                id: 6,
                image: 'cards/7_of_spades.png'
              }, {
                id: 7,
                image: 'cards/8_of_spades.png'
              }, {
                id: 8,
                image: 'cards/9_of_spades.png'
              }, {
                id: 9,
                image: 'cards/10_of_spades.png'
              }, {
                id: 10,
                image: 'cards/jack_of_spades.png'
              }, {
                id: 11,
                image: 'cards/queen_of_spades.png'
              }, {
                id: 12,
                image: 'cards/king_of_spades.png'
              },{
                id: 13,
                image: 'cards/ace_of_hearts.png'
              }, {
                id: 14,
                image: 'cards/2_of_hearts.png'
              }, {
                id: 15,
                image: 'cards/3_of_hearts.png'
              }, {
                id: 16,
                image: 'cards/4_of_hearts.png'
              }, {
                id: 17,
                image: 'cards/5_of_hearts.png'
              }, {
                id: 18,
                image: 'cards/6_of_hearts.png'
              }, {
                id: 19,
                image: 'cards/7_of_hearts.png'
              }, {
                id: 20,
                image: 'cards/8_of_hearts.png'
              }, {
                id: 21,
                image: 'cards/9_of_hearts.png'
              }, {
                id: 22,
                image: 'cards/10_of_hearts.png'
              }, {
                id: 23,
                image: 'cards/jack_of_hearts.png'
              }, {
                id: 24,
                image: 'cards/queen_of_hearts.png'
              }, {
                id: 25,
                image: 'cards/king_of_hearts.png'
              },
              {
                id: 26,
                image: 'cards/ace_of_clubs.png'
              }, {
                id: 27,
                image: 'cards/2_of_clubs.png'
              }, {
                id: 28,
                image: 'cards/3_of_clubs.png'
              }, {
                id: 29,
                image: 'cards/4_of_clubs.png'
              }, {
                id: 30,
                image: 'cards/5_of_clubs.png'
              }, {
                id: 31,
                image: 'cards/6_of_clubs.png'
              }, {
                id: 32,
                image: 'cards/7_of_clubs.png'
              }, {
                id: 33,
                image: 'cards/8_of_clubs.png'
              }, {
                id: 34,
                image: 'cards/9_of_clubs.png'
              }, {
                id: 35,
                image: 'cards/10_of_clubs.png'
              }, {
                id: 36,
                image: 'cards/jack_of_clubs.png'
              }, {
                id: 37,
                image: 'cards/queen_of_clubs.png'
              }, {
                id: 38,
                image: 'cards/king_of_clubs.png'
              },{
                id: 39,
                image: 'cards/ace_of_diamonds.png'
              }, {
                id: 40,
                image: 'cards/2_of_diamonds.png'
              }, {
                id: 41,
                image: 'cards/3_of_diamonds.png'
              }, {
                id: 42,
                image: 'cards/4_of_diamonds.png'
              }, {
                id: 43,
                image: 'cards/5_of_diamonds.png'
              }, {
                id: 44,
                image: 'cards/6_of_diamonds.png'
              }, {
                id: 45,
                image: 'cards/7_of_diamonds.png'
              }, {
                id: 46,
                image: 'cards/8_of_diamonds.png'
              }, {
                id: 47,
                image: 'cards/9_of_diamonds.png'
              }, {
                id: 48,
                image: 'cards/10_of_diamonds.png'
              }, {
                id: 49,
                image: 'cards/jack_of_diamonds.png'
              }, {
                id: 50,
                image: 'cards/queen_of_diamonds.png'
              }, {
                id: 51,
                image: 'cards/king_of_diamonds.png'
              }, {
                id: 52,
                image: 'faces/back.png'
              }
              ];

  return {
    all: function() {
      return cards;
    },
    back: function() {
      return cards[52];
    },
    
    map:function(number){
      var bj_card=null;
        return cards[number];
        //return cards[number%5];
    }
  };
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
        $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);
