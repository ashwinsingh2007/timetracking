(function() {
    var tasksFactory = function(appSettings, $http, $q,$rootScope) {
        var factory = [];
        factory.getTasks = function(userId, permissionUser) {
            var deferred = $q.defer();
            var json = { id: userId, permission: permissionUser,Type:'UniqueTask' };
            $http({
                method: "GET",
                url: "/api/tasks",
                withCredentials: true,
                params: json,
                headers: {
                    'Content-type': 'application/json',
                }
            }).then(function mySuccess(response) {
                deferred.resolve(response.data);
                return response.data;
            }, function myError(response) {
                return response.statusText;
            });
            return deferred.promise;
        };
        factory.addTaskByUserId = function(userId, userTask,permissionUser) {
            var deferred = $q.defer();
            var taskC = {};
            debugger;
            taskC.tasks = userTask.Name;
            //taskC.startDate = moment().format('x');
            taskC.startDate = moment().format("DD-MM-YYYY");
            taskC.seconds = 0;
            console.log(taskC);

            var json = {
                id: userId,
                task: JSON.stringify(taskC),
                Type:'UniqueTask',
                permission: permissionUser
            };
            $http({
                method: "POST",
                url: "/api/tasks",
                withCredentials: true,
                data: JSON.stringify(json),
                headers: {
                    'Content-type': 'application/json',
                }
            }).then(function mySuccess(response) {
                deferred.resolve(response.data);
                //check
                $rootScope.$broadcast('handleBroadcast');
                
                return response.data;
            }, function myError(response) {
                return response.statusText;
            });
            return deferred.promise;
        }
        factory.deleteTask = function(useridC, task,permissionUser) {
            debugger;
            var deferred = $q.defer();
            var json = { userid: useridC, id: task.tasks , Type:'UniqueTask' ,permission: permissionUser};
            $http({
                method: "DELETE",
                url: "/api/tasks",
                withCredentials: true,
                data: JSON.stringify(json),
                headers: {
                    'Content-type': 'application/json',
                }
            }).then(function mySuccess(response) {
                deferred.resolve(response.data);
                
                return response.data;
            }, function myError(response) {
                return response.statusText;
            });
            return deferred.promise;
        }
        factory.updateTask = function(useridC, previousTask,updatedTask,permissionUser) {
            debugger;
            var deferred = $q.defer();
            console.log(previousTask);
            console.log(updatedTask);
            var json = { userid: useridC, pTask: previousTask,uTask:updatedTask , Type:'UniqueTask',permission: permissionUser };
            $http({
                method: "PUT",
                url: "/api/tasks",
                withCredentials: true,
                data: JSON.stringify(json),
                headers: {
                    'Content-type': 'application/json',
                }
            }).then(function mySuccess(response) {
                deferred.resolve(response.data);
                
                //check
                $rootScope.$broadcast('handleBroadcast');
                return response.data;
            }, function myError(response) {
                return response.statusText;
            });
            return deferred.promise;
        }
        return factory;
    };

    tasksFactory.$inject = ['appSettings', '$http', '$q','$rootScope'];

    angular.module('appTimeTracker').factory('tasksFactory', tasksFactory);

}());