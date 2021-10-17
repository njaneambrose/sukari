//  Re-usable database pool connection across all files

var pg = require('pg');


var pool =  new pg.Pool({
    database: 'sukari', // replace with proceess.env.DB
    user: 'postgres', // replace with proceess.env.USER
    password: 'immortal', // replace with proceess.env.PASS
    connectionTimeoutMillis: 4000
});

module.exports.query  = function (query,opts,fn){
    pool.connect((err,client,release) =>{
        if(err){
            fn.call(this,err)
            release();
        }else{
            // if opts is an array especially for INSERT operations
            if (typeof opts === 'object'){
                client.query(query,opts, (a,b)=>{
                    fn.call(this,a,b);
                    release();
                })
            }else if(typeof opts === 'function'){ // if opts is a callback especially for SELECT operations
                client.query(query, (a,b)=>{
                    opts.call(this,a,b);
                    release();
                })
            }
        }
    });
}
