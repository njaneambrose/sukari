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
        $scope.check = function(){
            if($scope.logf.user.$valid && $scope.logf.pass.$valid){
                var bo = {};
                bo.u = $scope.user;
                bo.p = $scope.pass;
                $.post('/login',bo,function(s,m,d){
                    if(d.responseText === "001"){
                        $('p#error').text('Failed login. User not found please....Join')
                    }else if(d.responseText === "002"){
                        $('p#error').text('Failed login. Incorrect password');
                    }else if(d.responseText === "003"){
                        window.location = "/0";
                    }
                });
            }else{
                console.log('Err');
            }
        }
    }else if(loc.pathname === '/join'){
        $scope.jo = true;
        $scope.check2 = function(){
            if($scope.joinf.user.$valid && $scope.joinf.pass.$valid && $scope.joinf.email.$valid){
                var bo = {};
                bo.u = $scope.user;
                bo.p = $scope.pass;
                bo.e = $scope.email;
                $.post('/join',bo,function(s,m,d){
                    if(d.responseText === "DONE"){
                        window.location = '/0';
                    }else if(d.responseText === '001'){
                        $('p#error').text('User name is not available');
                    }
                });
            }else{
                $('p#error').text('Please check your input values enter a proper email and so a passweord must have .....');
            }
        }
    }else if(loc.pathname === '/recover'){
        $scope.re = true;
        $scope.check3 = function(){
            if($scope.recf.user.$valid){
                var bo = {};
                bo.u = $scope.user;
                $.post('/recover',bo,function(s,m,d){
                    if(d.responseText === '001'){
                        $('p#error').text('User not found');
                    }else if(d.responseText === '002'){
                        window.location = '/verify';
                    }
                    
                });
            }else{
                $('p#error').text('Please enter the correct input value for email or username');
            }
        }
    }else if(loc.pathname === '/update'){
        $scope.up = true;
        $scope.check5 = function(){
            if($scope.updf.pas.$valid && $scope.updf.pass.$valid){
                if($scope.pas === $scope.pass){
                    var bo = {};
                    bo.pass = $scope.pass;
                    $.post('/update',bo,function(s,m,d){
                        console.log(d);
                        if(d.responseText === '001'){
                            $('p#error').text('Failed to update password');
                        }else if(d.responseText === '002'){
                            window.location = '/0';
                        }
                    });
                }else{
                    $('p#error').text('Please enter matching passwords');
                }
            }else{
                $('p#error').text('Please enter correct password');
            }
        }
    }else if(loc
        .pathname === '/verify'){
        $scope.co = true;
        $scope.check4 = function(){
            if($scope.codf.code.$valid){
                var bo = {};
                bo.c = $scope.code;
                $.post('/verify',bo,function(s,m,d){
                    if(d.responseText === '001'){
                        $('p#error').text('Failed to recover account. Please try again');
                    }else if(d.responseText === '002'){
                        window.location = '/update';
                    }
                });
            }
        }
    }
    
    
}]);

App.controller('Ed',['$scope','$window',function($scope,$window){
    var loc = $window.location.pathname;
    $scope.ed = false
    $scope.cr = false;
    $scope.action =  "create";
    $scope.v = 0;
    if(loc === '/0/ads/edit'){
        $scope.ed = true;
        $scope.action =  "edit";
        $scope.v = $window.location.search.replace('?q=','');
    }else{
       $scope.cr = true; 
    }

}]);