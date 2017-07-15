(function() {

    var TasksController = function($scope, tasksFactory, recordsFactory, $cookieStore,$rootScope) {
        $scope.loaded = false;
        $scope.tasks = null;
        $scope.records = null;
        $scope.UserId = null;
        $scope.Permission = null;
        $scope.savePreviousTask=null;
        function init() {
            $scope.loaded = false;
            $scope.UserId = $cookieStore.get('UserId');
            $scope.Permission = $cookieStore.get('Permission');
            tasksFactory.getTasks($scope.UserId, $scope.Permission).then(function(data) {
                console.log(data);
                debugger;
                $scope.loaded = true;
                for(i in data){
                    if(data[i].startDate < moment().format("DD-MM-YYYY")){
                        data[i].disbl=true;
                    }else{
                        data[i].disbl=false;
                    }
                }
                $scope.tasks = data;
            });
            
        }

        $scope.getTimeSpent = function(task) {
            console.log(moment().startOf('day').seconds(task.seconds).format('HH:mm:ss'));
            return moment().startOf('day').seconds(task.seconds).format('HH:mm:ss');
        };
        function duplicateTaskNameCheck(name){
            var data=$scope.tasks;
            for(i in data){
                if(data[i].tasks.trim() == name.Name){
                    return true;
                }
            }
            return false;
        }
        $scope.addTask = function(name) {
            console.log(name);
            $scope.loaded = false;
            if(duplicateTaskNameCheck(name)){
                $scope.loaded = true;
                alert('Duplicate Task Should not be added !')
                return ;
            }
            tasksFactory.addTaskByUserId($scope.UserId, name,$scope.Permission).then(function(data) {
                $scope.loaded = true;
                $scope.tasks = data;
                debugger;
                $rootScope.$emit("CallMethod", data);

            });
        };

        $scope.updateTask = function(updatedTask) {
            $scope.loaded = false;
            tasksFactory.updateTask($scope.UserId,$scope.savePreviousTask, updatedTask,$scope.Permission).then(function(data) {
                $scope.loaded = true;
                for(i in data){
                    if(data[i].startDate < moment().format("DD-MM-YYYY")){
                        data[i].disbl=true;
                    }else{
                        data[i].disbl=false;
                    }
                }
                $scope.tasks = data;
                $rootScope.$emit("CallMethod", data);
            });
        };

        $scope.savePreviousTask = function(task){
            $scope.savePreviousTask=task;
        }
        $scope.deleteTask = function(task) {
            $scope.loaded = false;
            tasksFactory.deleteTask($scope.UserId, task,$scope.Permission).then(function(data) {
                $scope.loaded = true;
                for(i in data){
                    if(data[i].startDate < moment().format("DD-MM-YYYY")){
                        data[i].disbl=true;
                    }else{
                        data[i].disbl=false;
                    }
                }
                $scope.tasks = data;
                $rootScope.$emit("CallMethod", data);
            });
        };

        init();
    };

    TasksController.$inject = ['$scope', 'tasksFactory', 'recordsFactory', '$cookieStore','$rootScope'];

    angular.module('appTimeTracker').controller('TasksController', TasksController);

}());