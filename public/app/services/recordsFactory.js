(function() {
    var recordsFactory = function(appSettings, $http, $q) {
        var factory = [];
        factory.getRecords = function(idUser, permissionUser) {
            var deferred = $q.defer();
            var json = { id: idUser, permission: permissionUser };
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
        factory.addRecord = function(idUser, record ,permissionUser ) {
            var deferred = $q.defer();
            var recordC = {};
            debugger;
            recordC.tasks = record.tasks;
            recordC.startDate = record.dateStart;
            recordC.seconds = record.seconds;
            console.log('-------------------------------------');
            console.log(recordC,idUser);
            var json = {
                id: idUser,
                task: JSON.stringify(recordC),
                permission: permissionUser
            };     
            $http({
                method: "POST",
                url: "/api/tasks",
                withCredentials: true,
                data: json,
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
        factory.updateRecord = function(useridC,record , permissionUser) {
            var deferred = $q.defer();
            var json = { userid: useridC,id: record.id, name: record.tasks , permission: permissionUser };
            $http({
                method: "PUT",
                url: "/api/tasks",
                withCredentials: true,
                data: json,
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
        factory.deleteRecord = function(useridC,record ,permissionUser) {
            var deferred = $q.defer();
            var json = { userid: useridC,id: record.id  ,permission: permissionUser};
            $http({
                method: "DELETE",
                url: "/api/tasks",
                withCredentials: true,
                data: json,
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
        return factory;
    };
    recordsFactory.$inject = ['appSettings', '$http', '$q'];
    angular.module('appTimeTracker').factory('recordsFactory', recordsFactory);
}());