'use strict';

/* Services */

var servicesModule = angular.module('animatedGrid.services', []);

servicesModule.factory('ArticlesService', ['$q', '$http',
    function ($q, $http) {

        return {
            get: function () {

                var deferred = $q.defer(),
                    url = 'data/articles.json';
                  
                $http.get(url).success(function(data, status) {
  
                  deferred.resolve(data);

                }).error(function(data, status) {
                    console.log('There has been an error')
                    deferred.reject(data);
                });

                return deferred.promise;
            }
        };
    }
]);