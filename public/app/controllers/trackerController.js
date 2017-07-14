(function() {

    var TrackerController = function($scope, recordsFactory, statusFactory, tasksFactory, $interval, $cookieStore,$element,$rootScope) {
        $scope.loaded = false;
        $scope.counter = null;
        $scope.recordsmain = null;
        $scope.record = {};
        $scope.dateStart = null;
        $scope.UserId = null;
        $scope.Permission = null;
        $scope.status = null;
        $scope.disbl=false;
        $scope.interval = null;
        $scope.seconds=0;
        $scope.selectedItem=null;
        $scope.tasks=null;
        function init() {
            $scope.counter = "00:00:00";
            $scope.UserId = $cookieStore.get('UserId');
            $scope.Permission = $cookieStore.get('Permission');
            /*recordsFactory.getRecords($scope.UserId, $scope.Permission).then(function(data) {
                
            });*/
            tasksFactory.getTasks($scope.UserId, $scope.Permission).then(function(data) {
                console.log(data);
                $scope.recordsmain = data;
            });
            $scope.status=false;
            $scope.loaded = true;
        }

        $scope.updateTask=function(record) {
            $scope.record.tasks = record;
        }
        
        $rootScope.$on('CallMethod', function(event,data) {
            debugger;
            $scope.recordsmain = data;

        }); 
        
        function updateTime() {
            var seconds = moment().diff(moment($scope.dateStart, 'x'), 'seconds');
            var elapsed = moment().startOf('day').seconds(seconds).format('HH:mm:ss');
            $scope.counter = elapsed;
            $scope.seconds+=1;
        }

        function stopTime() {
            $scope.counter = "00:00:00";
            $scope.disbl=false;
            $interval.cancel($scope.interval);
            $scope.seconds=0;
        }

        $scope.startTracker = function() {
            if($scope.record.tasks == '' || !$scope.record.tasks){
                alert('Please select any task !');
                return;
            }
            $scope.seconds=1;
            $scope.status=true;
            $scope.disbl=true;
            //moment(moment().format('x'), "x").format("HH:mm:ss, DD-MM-YYYY")
            $scope.dateStart = moment().format('x');
            //$scope.dateStart = moment().format("DD-MM-YYYY");
            $scope.interval=$interval(updateTime, 1000)
        };

        $scope.stopTracker = function() {    

            $scope.status=false;
            $scope.record.dateStart = moment().format("DD-MM-YYYY") ;
            $scope.record.seconds = moment().diff(moment($scope.dateStart, 'x'), 'seconds');
            var seconds = $scope.seconds;
            console.log($scope.record);
            stopTime();
            $rootScope.$emit("renderLoader",{});
            recordsFactory.addRecord($scope.UserId, $scope.record,$scope.Permission).then(function(data) {
                $rootScope.$emit("callRecordCntrl", data);
            });
        };
        init();
    };
    TrackerController.$inject = ['$scope', 'recordsFactory', 'statusFactory', 'tasksFactory', '$interval', '$cookieStore','$element','$rootScope'];
    angular.module('appTimeTracker').controller('TrackerController', TrackerController);
}());