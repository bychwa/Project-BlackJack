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
    image: 'cards/jack_of_diamonds2.png'
  }, {
    id: 1,
    image: 'cards/jack_of_clubs2.png'
  }, {
    id: 2,
    image: 'cards/4_of_clubs.png'
  }, {
    id: 3,
    image: 'cards/3_of_diamonds.png'
  }, {
    id: 4,
    image: 'cards/queen_of_hearts2.png'
  }, {
    id: 5,
    image: 'cards/jack_of_hearts2.png'
  }];



  return {
    all: function() {
      return cards;
    },
    map:function(number){
      var bj_card=null;
        //return cards[number];
        return cards[number%5];
    }
  };
});
