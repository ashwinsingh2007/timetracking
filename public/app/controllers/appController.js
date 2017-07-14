(function() {

    var AppController = function($scope, $location, appSettings) {
        $scope.appSettings = appSettings;

        $scope.navIsActive = function(path) {
            //console.log(path);
            return path === $location.path();
        };
    };

    AppController.$inject = ['$scope', '$location', 'appSettings'];

    angular.module('appTimeTracker').controller('AppController', AppController);

}());