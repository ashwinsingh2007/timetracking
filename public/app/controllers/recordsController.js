(function() {

    var RecordsController = function($scope, recordsFactory, tasksFactory, $cookieStore, $cookies,$rootScope) {
        $scope.loaded = false;
        $scope.tasks = null;
        $scope.records = null;
        $scope.UserId = null;
        $scope.Permission = null;

        function init() {
            $scope.loaded = false;
            $scope.UserId = $cookieStore.get('UserId');
            $scope.Permission = $cookieStore.get('Permission');
            tasksFactory.getTasks($scope.UserId, $scope.Permission).then(function(data) {
                $scope.tasks = data;
            });
            recordsFactory.getRecords($scope.UserId, $scope.Permission).then(function(data) {
                $scope.records = [];
                for(i in data){
                    if(data[i].seconds > 0){
                        $scope.records.push(data[i])
                    }
                }
                $scope.loaded = true;
            });
        }

        $scope.getRecords = function(log) {
            return null;
        };
        $scope.deleteRecord = function(record) {
            $scope.loaded = false;
            recordsFactory.deleteRecord($scope.UserId,record,$scope.Permission).then(function(data) {
                $scope.loaded = true;
                $scope.records = [];
                for(i in data){
                    if(data[i].seconds > 0){
                        $scope.records.push(data[i])
                    }
                }
                console.log($scope.records);
            });
        }
        $scope.updateRecordsList = function(record) {
            recordsFactory.updateRecord($scope.UserId,record,$scope.Permission).then(function(data) {
                debugger;
                $scope.records = [];
                for(i in data){
                    if(data[i].seconds > 0){
                        $scope.records.push(data[i])
                    }
                }
            });
        }

        $scope.getDateStart = function(record) {
           //return moment(record.startDate, "x").format("HH:mm:ss, DD-MM-YYYY");
            return record.startDate;
        };

        $scope.getTime = function(record) {
            return moment().startOf('day').seconds(record.seconds).format('HH:mm:ss');
        };
        $rootScope.$on('callRecordCntrl', function(event,data) {
            debugger;
            $scope.records = [];
            for(i in data){
                if(data[i].seconds > 0){
                    $scope.records.push(data[i])
                }
            }
            $scope.loaded = true;
        });

        $rootScope.$on('renderLoader', function() {
            $scope.loaded = false;        
        });  

        init();
    };

    RecordsController.$inject = ['$scope', 'recordsFactory', 'tasksFactory', '$cookieStore', '$cookies','$rootScope'];

    angular.module('appTimeTracker').controller('RecordsController', RecordsController);

}());