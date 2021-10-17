var c = require('./db');

c.query('SELECT * FROM ads WHERE uid=$1::integer',[2],(a,b)=>{
    console.log(a,b);
})