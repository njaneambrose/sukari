var express = require('express');
var router = express.Router();
var pa = require('../pat');
var db = require('./db');
var path = require('path');
var uuid = require('uuid-by-string');
const { Console } = require('console');



/*

Keys to help navigation of records

Use the key(number) to query the db

===type of relationshipm keys ===
1 Long term relationship
2 short term relationship
3 Hookup
4 one date
5 sponsor

=== Orientation of relationship ====
1 Straight
2 Bi Sexual
3 invert

=== Gender ===
1 male
2 female
3 other

*/

/* GET home page. */
router.get('/', (req, res) => {
  // Basic page structure passed over the wire with no functional data -> Faster loading
  // Fancy pre-load as we load data from the server
  res.render('index',{title: 'Express'});

  /*
   the functional data is loaded using the [/find  post request] using ajax and loaded into pade asynchrously 
  */
});


router.post('/find', (req,res) =>{
// Router is supposed to be triggred by an Angular.js / Ajax service to start querying for partners
// Check cookies / prevously saved data by user on parameters for finding a mate
// If no previous a prompt in client side should allpw one to choose what they are looking for 
/*
   Needs to begin search
   1. type of relationship
   2 orientation of desired relationship
   3 gender searching for
   4 age range of required partner

==== use this user query to scan the database for matches and rank from the newest to oldest
*/ 
// Return JSON data
  var q = req.body
  var age = q['r[]'];
  var or_keys = {
    'Straight': 1,'Bi': 2,'Invert': 3  }  
  var or  = or_keys[q.or]; 
  if(JSON.parse(q.ge) === 3){
    db.query(`SELECT * FROM ads WHERE tp=$1::integer AND "or"=$2::integer
    AND age >= $3::integer AND age <= $4::integer`,[q.tp,or,age[0],age[1]],function(err,data){
       if(err){
         res.send('ERR')
         console.log(err);
       }else{
           res.send(data.rows);
       }
    });
  }else{
    db.query(`SELECT * FROM ads WHERE tp=$1::integer AND "or"=$2::integer AND gender=$3::integer
   AND age >= $4::integer AND age <= $5::integer`,[q.tp,or,q.ge,age[0],age[1]],function(err,data){
      if(err){
        res.send('ERR')
        console.log(err);
      }else{
          res.send(data.rows);
      }
   });
  } 


});

router.get('/random', (req,res)=>{
  // Request random ads and suggestions without any specific search criteria
  // Good when user is not yet seaching or general pourpose
  db.query('SELECT * FROM ads ORDER BY RANDOM() LIMIT 10',(err,rows)=>{
    if(err){
      console.log(err);
      res.send('ERR')
    }else{
      res.send(rows.rows);
    }
  });

})

router.post('/co', (req,res)=>{
  // recieves and add a comment to database for a posted ad
  // interested candidates / DMS 
  db.query('INSERT INTO comments(adid,comment) VALUES ($1::integer,$2::text)',[req.body.id,req.body.co],
  function(err){
    if(err){
      res.send('ERR');
      console.log(err);
    }else{
      res.send('DONE')
    }
  }) 
})

router.get('/about',(req,res)=>{
 // about Us page
    res.render('1')

});

// login page
router.get('/login',(req,res)=>{
  if(req.cookies.ga !== undefined && req.cookies.uuid  !== undefined){
    var bo = req.cookies;
    db.query('SELECT uuid FROM users WHERE uname=$1::text LIMIT 1',[bo.ga],
    function(err,rows){
        if(err){
          console.log(err)
        }else if(rows.rows.length === 0){
          res.send('001')
        }else{
          db.query('SELECT uname,uuid FROM users WHERE uuid=$1::text AND uname=$2::text LIMIT 1',[bo.uuid,bo.ga],
          function(err,data) {
            if(err){
              console.log(err)
            }else if(data.rows.length === 0){
                res.send('002')
            }else{
              res.redirect('/0');
            }
          })
        }
    });

  }else{
    res.sendFile(path.join(pa, '/public/uni.html'));
  }
});

//login request
router.post('/login',(req,res)=>{
  var bo = req.body;
  db.query('SELECT uuid FROM users WHERE uname=$1::text LIMIT 1',[bo.u],
  function(err,rows){
      if(err){
        console.log(err)
      }else if(rows.rows.length === 0){
        res.send('001')
      }else{
        var h = uuid(rows.rows[0].uuid+bo.p);
        db.query('SELECT uname,uuid FROM users WHERE pass=$1::text AND uname=$2::text LIMIT 1',[h,bo.u],
        function(err,data) {
          if(err){
            console.log(err)
          }else if(data.rows.length === 0){
              res.send('002')
          }else{
            res.cookie('uuid',data.rows[0].uuid,{expires: new Date(Date.now() + 900000000),httpOnly: true});
            res.cookie('ga',data.rows[0].uname,{expires: new Date(Date.now() + 900000000),httpOnly: true});
            res.send('003');
          }
        })
      }
  });

});

//join page

router.get('/join',(req,res)=>{
  res.sendFile(path.join(pa, '/public/uni.html'))
})

//join request
router.post('/join',(req,res)=>{
  var bo = req.body;
  var d = uuid(new Date().toString())
  var pass = uuid(d+bo.p)
  db.query('SELECT uname FROM users WHERE uname=$1::text',[bo.u],
  function(err,d){
    if(err){
      console.log(err)
    }else if(d.rows.length !== 0){
        res.send('001');
    }else{
      db.query('INSERT INTO users(uname,pass,uuid,email) VALUES($1::text,$2::text,$3::text,$4::text)',[bo.u,pass,d,bo.e],
      function(err){
          if(err){
            console.log(e)
          }else{
            res.cookie('uuid',d,{expires: new Date(Date.now() + 900000000),httpOnly: true});
            res.cookie('ga',bo.u,{expires: new Date(Date.now() + 900000000),httpOnly: true});
            res.send('DONE');
          }
      });
    }
  })

});

// recover account page

router.get('/recover',(req,res)=>{
  res.sendFile(path.join(pa, '/public/uni.html'))
})

// recover account request

router.post('/recover',(req,res)=>{
  var bo = req.body;
  db.query('SELECT email,uname FROM users WHERE uname=$1::text OR email=$1::text LIMIT 1',[bo.u],
  function(err,data){
      if(err){
        console.log(err);
      }else if(data.rows.length === 0){
        res.send('001')
      }else{
        var code = JSON.stringify(Math.round(Math.random()*30000));
        db.query('DELETE FROM recover WHERE usern=$1::text',[bo.u],function(){
            if(err){
              console.log(err);
            }else{
              db.query("INSERT INTO recover(usern,code) VALUES($1::text,$2::text)",[bo.u,code],
              function(err){
                if(err){
                  console.log(err);
                }else{
                  res.cookie('r',data.rows[0].uname,{expires: new Date(Date.now() + 720000),httpOnly: true}); //expires in 30 minutes
                  res.send('002');
                }
              })
            }
        });
      }
  })

})

// Recover account verification

router.get('/verify',(req,res)=>{
  res.sendFile(path.join(pa, '/public/uni.html'))
});

router.post('/verify',(req,res)=>{
  if(req.cookies.r === undefined){
    res.send('001');
  }else{
    db.query('SELECT code FROM recover WHERE usern=$1::text AND code=$2::text',[req.cookies.r,req.body.c],
    function (err,data) {
      if(err){
        console.log(err);
      }else if(data.rows.length === 0){
        res.send('001')
      }else{
        res.send('002')
      }
    });
  }

});

router.get('/update',(req,res)=>{
  res.sendFile(path.join(pa, '/public/uni.html'))
})

router.post('/update',(req,res)=>{
  if(req.cookies.r === undefined){
    res.send('001')
  }else{
    var bo = req.body;
    var h = uuid(new Date().toString());
    var pass = uuid(h+bo.pass);
    db.query('UPDATE users SET pass=$1::text,tmsp=now(),uuid=$3::text WHERE uname=$2::text',[pass,req.cookies.r,h],
    function(err) {
      if(err){
        console.log(err);
      }else{
          res.cookie('uuid',h,{expires: new Date(Date.now() + 900000000),httpOnly: true});
          res.cookie('ga',req.cookies.r,{expires: new Date(Date.now() + 900000000),httpOnly: true});
          res.cookie('r','',{expires: new Date(Date.now() + 0),httpOnly: true});
          res.send('002');
      }
    })
  }
});

function verify(user,hash,back){
  db.query('SELECT uname,uid FROM users WHERE uname=$1::text AND uuid=$2::text LIMIT 1',[user,hash],
  function(err,data){
    if(err){
      console.log(err);
    }else if(data.rows.length === 0){
      back.call(this,false);
    }else{
      back.call(this,true,data.rows[0].uid)
    }
  })
}
// User account

router.get('/0',(req,res)=>{
  if(req.cookies.ga !== undefined && req.cookies.uuid !== undefined){
      verify(req.cookies.ga,req.cookies.uuid,function(val){
          if(val){
            res.sendFile(path.join(pa, '/public/0.html'));
          }else{
            res.redirect('/');
          }
      });
  }else{
    res.redirect('/')
  }
});

// Extract user ads

router.get('/0/ads',(req,res)=>{
  if(req.cookies.ga !== undefined && req.cookies.uuid !== undefined){
    verify(req.cookies.ga,req.cookies.uuid,function(val,id){
        if(val){
            db.query('SELECT * FROM ads WHERE uid=$1::integer ORDER BY tmsp DESC LIMIT 10',[id],
            function(err,data){
              if(err){
                Console.log(err)
              }else{
                data.rows.forEach(e => {
                  db.query('SELECT count(cid) AS no FROM comments WHERE adid=$1::integer',[e.aid],
                  function(err,da){
                    if(err){
                      console.log(err);
                    }else{
                      e.c = da.rows[0].no;
                    }
                  })
                });
                setTimeout(function(){
                  res.send(data.rows);
                },300)
              }
            })
        }else{
          res.redirect('/');
        }
    });
}else{
  res.send('000')
}
});

router.get('/0/ads/page/:page',(req,res)=>{
    if(req.cookies.ga !== undefined && req.cookies.uuid !== undefined){
      verify(req.cookies.ga,req.cookies.uuid,function(val,id){
        if(val){
          var off = (parseInt(req.params.page)-1)*10
          db.query('SELECT * FROM ads WHERE uid=$1::integer ORDER BY tmsp DESC OFFSET $2 LIMIT 10',[id,off],
          function(err,data){
            if(err){
              Console.log(err)
            }else{
              data.rows.forEach(e => {
                db.query('SELECT cid AS no FROM comments WHERE adid=$1::integer',[e.aid],
                function(err,da){
                  if(err){
                    console.log(err);
                  }else{
                    e.c = da.rows.length;
                  }
                })
              });
              setTimeout(function(){
                res.send(data.rows);
              },300)
            }
          })
        }else{
          res.send('000')
        }
      })
    }
});


// create ad [GET]
router.get('/0/ads/create',function(req,res){
  if(req.cookies.ga !== undefined && req.cookies.uuid !== undefined){
    verify(req.cookies.ga,req.cookies.uuid,function(val){
        if(val){
          res.sendFile(path.join(pa, '/public/1.html'));
        }else{
          res.send('000');
        }
    });
  }else{
    res.send('000')
  }
});


//create ad [POST]
router.post('/0/ads/create',function(req,res){
  if(req.cookies.ga !== undefined && req.cookies.uuid !== undefined){
    verify(req.cookies.ga,req.cookies.uuid,function(val){
        if(val){
          res.send('0003');
          console.log(req.body);
        }else{
          res.send('000');
        }
    });
  }else{
    res.send('000')
  }
});


//edit ad [GET]

router.get('/0/ads/edit',function(req,res){
  if(req.cookies.ga !== undefined && req.cookies.uuid !== undefined){
    verify(req.cookies.ga,req.cookies.uuid,function(val){
        if(val){
          res.sendFile(path.join(pa, '/public/1.html'));
        }else{
          res.send('000');
        }
    });
  }else{
    res.send('000')
  }
});

//edit ad [GET]
router.get('/0/ads/edit/:q',function(req,res){
  if(req.cookies.ga !== undefined && req.cookies.uuid !== undefined){
    verify(req.cookies.ga,req.cookies.uuid,function(val){
        if(val){
          db.query('SELECT * FROM ads WHERE aid=$1::integer LIMIT 1',[req.params.q],
            function(err,data){
              if(err){
                console.log(err)
              }else{
                res.send(data.rows);
              }
            })
        }else{
          res.send('000');
        }
    });
  }else{
    res.send('000')
  }
});

//edit ad [POST]
router.post('/0/ads/edit/:q',function(req,res){
  if(req.cookies.ga !== undefined && req.cookies.uuid !== undefined){
    verify(req.cookies.ga,req.cookies.uuid,function(val){
        if(val){
         res.send('000');
         console.log(req.body);
        }else{
          res.send('000');
        }
    });
  }else{
    res.send('000')
  }
});

//delete ad[GET]

router.get('/0/ads/delete/:q',function(req,res){
  if(req.cookies.ga !== undefined && req.cookies.uuid !== undefined){
    verify(req.cookies.ga,req.cookies.uuid,function(val){
        if(val){
          console.log(req.params.q);
         res.send('000');
        }else{
          res.send('000');
        }
    });
  }else{
    res.send('000')
  }
});

router.get('/0/ads/c/:c',(req,res)=>{
  if(req.cookies.ga !== undefined && req.cookies.uuid !== undefined){
    verify(req.cookies.ga,req.cookies.uuid,function(val){
        if(val){
          db.query('SELECT * FROM comments WHERE adid=$1::integer ORDER BY tmsp DESC LIMIT 30 ',[req.params.c],function(err,data){
            if(err){
              console.log(err)
            }else{
              res.send(data.rows);
            }
          })
        }else{
          res.send('000');
        }
    });
  }else{
    res.send('000')
  }

});



module.exports = router;
