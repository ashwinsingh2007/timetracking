(function() {
    var statusFactory = function(appSettings) {
        var factory = [];

        factory.getStatus = function() {

        };

        factory.setStatus = function(params) {

        };

        return factory;
    };


    statusFactory.$inject = ['appSettings'];

    angular.module('appTimeTracker').factory('statusFactory', statusFactory);

}());