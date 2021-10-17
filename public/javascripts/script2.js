$(function(){
    $('[data-action="join"]').click(function(){
        var bo = {};
        bo.u = $('div.join-form [name="user"]').val();
        bo.p = $('div.join-form [name="pass"]').val();
        bo.e = $('div.join-form [name="email"]').val();
       
        $.post('/join',bo,function(status,data){

        });
    });

    $('[data-action="login"]').click(function(){
        var bo = {};
        bo.u = $('div.login-form [name="user"]').val();
        bo.p = $('div.login-form [name="pass"]').val();
        $.post('/login',bo,function(status,data){

        });
    });

    $('[data-action="recover"]').click(function(){
        var bo = {};
        bo.u = $('div.recover-form [name="user"]').val();
        $.post('/recover',bo,function(status,data){
            if(data === 'success'){
                window.location = '/verify'
            }
        });
    });

    $('[data-action="code"]').click(function(){
        var bo = {};
        bo.c = $('div.code-form [name="code"]').val();
        $.post('/verify',bo,function(status,data){
            if(data === 'success'){
                window.location = '/update'
            }
        });
    });

    $('[data-action="update"]').click(function(){
        var bo = {};
        bo.pass = $('div.update-form [name="pass"]').val();
        $.post('/update',bo,function(status,data){

        });
    });

    
});