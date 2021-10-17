var App = angular.module('Sukari App',[])

App.controller('Forms',['$scope','$window',function ($scope,$window) {
    var loc = $window.location;

    $scope.lo = false;
    $scope.jo = false;
    $scope.re = false;
    $scope.up = false;
    $scope.co = false;

    if(loc.pathname === '/login'){
        $scope.lo = true;
    }else if(loc.pathname === '/join'){
        $scope.jo = true;
    }else if(loc.pathname === '/recover'){
        $scope.re = true;
    }else if(loc.pathname === '/update'){
        $scope.up = true;
    }else{
        $scope.co = true;
    }
    
    
}]);