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
  };
});
