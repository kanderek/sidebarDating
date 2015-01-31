var express = require('express');
var app = express();

var fs = require('fs');
var moment = require('moment');
var ziptastic = require('ziptastic');
var im = require('imagemagick');
var q = require('q');

var https = require('https');
var http = require('http');

// http.createServer(app).listen(80);
// https.createServer(options, app).listen(443);

//Create the AlchemyAPI object
var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();


//Database modules for working with postgresql
var pg = require('pg');
var pgclient = require('connect-pgclient');

//Modules for using node events
var events = require("events");
var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

var pkey = fs.readFileSync('key.pem');
var pcert = fs.readFileSync('cert.pem');

var options = {
    key: pkey,
    cert: pcert
};

//For Socket.io
var server = http.createServer(app);
var secureServer = https.createServer(options, app);
// var io = require('socket.io').listen(server);


// app.listen(3000);
server.listen(process.env.PORT || 3000);
secureServer.listen(8443);

console.log("server listening at port 3000");
console.log("secure server listening at port 8443");

//postgres://{user}:{pass}@some-ec2-instance:{port}/{db}
var dbConfigObj = {};
if(process.env.DATABASE_URL){
     var re1 = /^postgres:\/\/(\w+):(\w+)@([a-zA-z0-9-.]+):(\d+)\/([a-zA-Z0-9]+)$/;
     var dbConfig = re1.exec(process.env.DATABASE_URL);
     dbConfigObj = {
        PGDATABASE: dbConfig[5],
        PGUSER: dbConfig[1],
        PGPASS: dbConfig[2],
        PGHOST: dbConfig[3],
        PGPORT: parseInt(dbConfig[4], 10)
     };
}

 var connectToDb = pgclient({
    config : {
        database : dbConfigObj.PGDATABASE || 'sidebar',
        user     : dbConfigObj.PGUSER || 'sidebar',//'derekkan',//Christina',
        host     : dbConfigObj.PGHOST || 'localhost',
        port     : dbConfigObj.PGPORT || 5432,
        password : dbConfigObj.PGPASS || '',
    }
});

var DEMO = true;
var pgConnectionString = process.env.DATABASE_URL || "postgres://sidebar:5432@localhost/sidebar";

//"postgres:// dvybsfqqxhtvlt :ep3gKsF6uWa7qmnWKbM1_wWRIk @ec2-54-83-43-49.compute-1.amazonaws.com: 5432 /d5ct0tand6bndq"

console.log(process.env.DATABASE_URL);
// console.log(dbConfigObj);


var client = new pg.Client(pgConnectionString);
client.connect();
client.query('LISTEN "watchers"');
client.on('notification', function(data) {
    console.log('###################### notification received ######################');
    ee.emit('new_notification', data);
});

function listenForNotifications(req,res,next){
      // req.db.client.on('notification', function(msg) {
      //      ee.emit('new_notification', msg);
      // });
      // var query = req.db.client.query("LISTEN watchers");
      next();
}

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use('local-login', new LocalStrategy({
        usernameField: 'email',//can be anything including email
        passwordField: 'password',
        passReqToCallback: true
   },
  function(req, email, password, done) {
    // console.log(req.body);
    var queryString = "SELECT userid, password FROM users WHERE email='" + email + "'";

    // console.log(queryString);
    req.db.client.query(queryString, function(err, result){
        // console.log(err);
        // console.log(result);
      if (err) { return done(err); }
      if (result.rows.length === 0) {
        return done(null, false, { message: 'Incorrect email.' });
      }
      if (result.rows[0].password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, result.rows[0]);
    });
  }
));

// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
    console.log(req.body);
    var queryString = "SELECT userid, password FROM users WHERE email='" + email + "'";

    console.log(queryString);
    req.db.client.query(queryString, function(err, result){
        // console.log(err);
        // console.log(result);
      if (err) { return done(err); }
      // if (result.rows.length < 1) {
      //   return done(null, false, { message: 'account already exists with that email.' });
      // }
      else{
        console.log(result.rows);
        console.log('create new user here');
        return done(null, result.rows[0]);
      }
    });
  }
));


passport.serializeUser(function(user, done) {
    // console.log('serialize user...')
    // console.log(user);
  done(null, user.userid);
});

passport.deserializeUser(function(req, userid, done) {
  var queryString = "SELECT (userid) FROM users WHERE userid=" + userid;

  req.db.client.query(queryString, function(err, result){
    // console.log('deserialize user..');
    // console.log(result);
    done(err, result.rows[0]);
  });
});

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function(){
  // app.use(express.static(__dirname + '/public'));
  // app.use(express.static(__dirname + '/files'));
  app.use(express.logger());
  app.use(express.static(__dirname + '/static/images'));
  app.use(express.static(__dirname + '/static/icons'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.json());
  app.use(express.urlencoded());
  // app.use(flash());
  app.use(connectToDb);
  app.use(listenForNotifications);
  app.use(express.session({ secret: 'so secret'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(allowCrossDomain);
  app.use(app.router);
});

app.get('/', function(req, res){
  res.send('hello world');
});

app.post('/signup',
    demoSignup,
    createNewUser,
    createNewUserPref,
    passport.authenticate('local-signup'),

    function(req, res, next){
        console.log('after local sign up');
        next();
    },
    function(req, res){
        console.log('posted signup form data');

            console.log('authenticating user...on signup');
            //console.log(req.body);
            console.log(req.signupResult);
            console.log(req.prefResult);
            var age = calculateAge(req.signupResult.dateofbirth);
            req.signupResult.age = age;
            res.json({user: req.signupResult, pref: req.prefResult});
        });

function demoSignup(req, res, next){
    console.log("DEMO MODE? " + DEMO);
    if(DEMO){
        var queryString = "SELECT * FROM users, userprefs WHERE users.userid = userprefs.userid AND email='" + req.body.user.email + "' AND password='" + req.body.user.password + "'";

        console.log(queryString);
         req.db.client.query(queryString, function(err, result){

            if(err){
                console.log(err);
                console.log('error selecting user on demo signup...');
                res.send(500);
            }
            else{
                if(result.rows.length === 0) {
                    req.skipSignup = false;
                    next();
                }
                else{
                    req.prefResult = result.rows[0];
                    req.signupResult = result.rows[0];
                    req.skipSignup = true;
                    next();
                }
            }
        });
    }
    else{
        next();
    }
}

function createNewUser(req, res, next){

    if(!req.skipSignup){
        console.log('im in createnewuser');
        var user = req.body.user;
        user.dateofbirth = moment([user.dob_year, user.dob_month, user.dob_day]).format('YYYY-MM-DD');//'1982-11-27'

        console.log('creating new uers...');
        console.log(user);

        var urls = "'{";
        var medurls = urls;
        var smallurls = urls;
        if(user.originalImageUrl){
            for(var i=0; i<user.originalImageUrl.length; i++){
                urls += '"' + user.originalImageUrl[i] + '"';
                medurls += '"' + user.mediumImageUrl[i] + '"';
                smallurls += '"' + user.smallImageUrl[i] + '"';
                if(i != user.originalImageUrl.length - 1){
                    urls += ",";
                    medurls += ",";
                    smallurls += ",";
                }
            }
        }
        urls += "}'";
        medurls += "}'";
        smallurls += "}'";

        getCityStateFromZipcode(user.zipcode, function(location){

            var queryString = "INSERT INTO users " +
                                        "(username," +
                                          "email," +
                                          "password," +
                                          "gender," +
                                          "dateofbirth," +
                                          "zipcode," +
                                          "location_city," +
                                          "location_state," +
                                          "personal_blurb," +
                                          "imageurls," +
                                          "medimageurls," +
                                          "smallimageurls, logged_in) " +
                                   "VALUES ('" + user.username  + "','" +
                                                 user.email + "','" +
                                                 user.password + "','" +
                                                 user.gender + "','" +
                                                 user.dateofbirth + "','" +
                                                 user.zipcode + "','" +
                                                 location.city + "','" +
                                                 location.state + "','" +
                                                 replaceAll("'", "''", user.personal_blurb) + "'," +
                                                 urls + "," +
                                                 medurls + "," +
                                                 smallurls + " , 't') " +
                                    "RETURNING *";
            console.log(queryString);

            req.db.client.query(queryString, function(err, result){

                if(err){
                    console.log(err);
                    console.log('error inserting users...');
                    res.send(500);
                }
                else{
                    req.signupResult = result.rows[0];
                     console.log("result of inserting user...");
                    console.log(result.rows[0].userid);
                    req.userid = result.rows[0].userid;
                    // console.log("Errors?...");
                    // console.log(err);
                    // console.log
                    next();
                }
            });
        });
    }
    else{
        next();
    }
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function createNewUserPref(req, res, next){
    if(!req.skipSignup){
        console.log('im in createnewuserpref');
        var pref = req.body.pref;
        var queryString = "INSERT INTO userprefs " +
                                    "(userid," +
                                      "male," +
                                      "female," +
                                      "age_min," +
                                      "age_max," +
                                      "distance_max) " +
                               "VALUES (" + req.userid  + "," +
                                             pref.male + "," +
                                             pref.female + "," +
                                             pref.age_min + "," +
                                             pref.age_max + "," +
                                             pref.distance_max + ") " +
                             "RETURNING *";
        // console.log(queryString);

        req.db.client.query(queryString, function(err, result){
            req.prefResult = result.rows[0];
            // console.log("result of inserting user preferences...");
            // console.log(result);
            // console.log("Errors?...");
            // console.log(err);
            // console.log
            next();
        });
    }else{
        next();
    }

}




app.post('/upload',
    //connectToDb,
    // passport.authenticate('local'),
    function(req, res, next){
        console.log('this is the body of the file uploads');
        console.log(req.files);
        console.log("file uploaded to temp folder!...");
        // console.log(req.user);

        fs.readFile(req.files.file.path, function (err, data) {
          if(!err){
              var newPath = __dirname + '/static/images/orig_' + req.files.file.name;
              var medPath = __dirname + '/static/images/med_' + req.files.file.name;
              var smallPath = __dirname + '/static/images/small_' + req.files.file.name;
              var scaledPath = __dirname + '/static/images/scaled_' + req.files.file.name;
              // var newPath = __dirname + "/uploads";
              console.log('begin writing to folder ' + newPath );
              fs.writeFile(newPath, data, function (err) {
                //res.redirect("back");
                if(err){
                    console.log(err);
                    console.log('error writing file to directory');
                    res.send(501);
                 }
                 else{

                    im.resize({
                        srcPath: newPath,
                        dstPath: scaledPath,
                        height: 300
                    },function(err,stdout,stderr){
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log("resized image to be 300 px tall");

                            // im.resize({
                            im.crop({
                              srcPath: newPath,
                              dstPath: medPath,
                              width:   150,
                              height: 150,
                              quality: 100,
                              gravity: "Center"//default gravity is Center
                            }, function(err, stdout, stderr){
                              if (err){
                                console.log(err);
                              }
                              else{
                                console.log('cropped image to fit within 200x200px');
                                console.log('resizeed image to fit within 200x200px');

                                im.crop({
                                  srcPath: newPath,
                                  dstPath: smallPath,
                                  width:   36,
                                  height: 36,
                                  quality: 100,
                                  gravity: "Center"//default gravity is Center
                                }, function(err, stdout, stderr){
                                  if (err){
                                    console.log(err);
                                  }
                                  else{
                                    console.log('cropped image to fit within 36x36px');
                                    next();
                                    // console.log('resizeed image to fit within 200x200px');
                                  }
                                });
                        }
                    });

                        }
                    });

                 }
              });
            }
            else{
                console.log(err);
                console.log('error: could not read file form path ');
                res.send(501);
            }
        });
    },
    function(req,res){
        res.json({origImageUrl: '/scaled_' + req.files.file.name,
                  medImageUrl: "/med_" + req.files.file.name,
                  smallImageUrl: "/small_" + req.files.file.name

        });
    });


app.post('/login',
    //connectToDb,
    passport.authenticate('local-login'),
    function(req, res, next){
        var queryString = "UPDATE users " +
                                "SET logged_in = 't'" +
                                    " WHERE userid = " + req.user.userid;
        //console.log(queryString);

        req.db.client.query(queryString, function(err, result){
            // console.log('result: ');
            // console.log(result);
            // console.log('err: ');
            // console.log(err);
            next();
        });
    },
    function(req, res){
        console.log(req.body);
        console.log("user authenticated!...");
        console.log(req.user);
        res.json({userid: req.user.userid});
    });

app.get('/logout',
    function(req, res, next){

        if(req.user){
            var queryString = "UPDATE users " +
                                    "SET logged_in = 'f'" +
                                        " WHERE userid = " + req.user.userid;
            console.log(queryString);

            req.db.client.query(queryString, function(err, result){
                // console.log('result: ');
                // console.log(result);
                // console.log('err: ');
                // console.log(err);
                next();
            });
        }
        next();
    },
    function(req, res){

      req.logout();
      res.send(200);
    });

app.get('/authentication_status', function(req, res){
    console.log(req.user);
    // console.log(req.user.userid);
    if(req.user){
        res.json({status: "logged_in", userid: req.user.userid});
    }
    else{
        res.json({status: 'logged_out'});
    }
});

//use this middleware for routes that require a user to be logged in/authenticated

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.json({status: "logged_out"});
}

app.get('/message/:partnerId',
    // ensureAuthenticated,
    function(req, res, next){
        var userId = req.query.userId; //Can probably get from session req.user.userId;
        var partnerId = req.params.partnerId;

        var queryString = "SELECT senderId, receiverId, message, sendTime " +
                            "FROM messages " +
                            "WHERE (senderId=" + userId + " AND receiverId=" + partnerId + ") OR "+
                                "(receiverId=" + userId + " AND senderId=" + partnerId + ")" +
                            "ORDER BY sendTime ASC";

        //console.log(queryString);

        req.db.client.query(queryString, function(err, result){
            req.queryResult = result;
            next();
        });
    },
    function(req, res){
        //console.log(req.queryResult.rows);
        res.json(req.queryResult.rows);

    });

app.post('/message',
    //connectToDb,
    function(req, res, next){
        // console.log(req.user);
        var senderId = req.body.senderid;
        var receiverId = req.body.receiverid;
        var message = req.body.message;
        var sendTime = moment().format('YYYY-MM-DD HH:mm:ss');

        console.log(req.body);
        var queryString = "INSERT INTO messages " +
                                "(senderId, receiverId, message, sendTime) " +
                           "VALUES (" + senderId + "," + receiverId + ",'" + replaceAll("'", "''", message) + "','" + sendTime + "') " +
                           "RETURNING *";
        //console.log(queryString);

        req.db.client.query(queryString, function(err, result){
            console.log('result: ');
            console.log(result);
            console.log('err: ');
            console.log(err);
            console.log(queryString);
            ee.emit('message-added', result.rows[0]);
            next();
        });
    },
    function(req, res){
        res.send(200);
    });

app.get('/notifications/:userid',
    function(req, res, next){
        var userid = req.params.userid;

        var queryString = "select t0.*, u.smallimageurls from (SELECT n.notificationid, n.userid, n.about_userid, n.message, n.extra_message,  n.action_time, n.type, n.subtype, n.status " +
                            "FROM notifications n " +
                            "WHERE n.userid=" + userid +
                            "ORDER BY action_time DESC) as t0 "+
                        "join users u on t0.about_userid=u.userid ORDER BY action_time DESC";

        console.log(queryString);

        req.db.client.query(queryString, function(err, result){
            req.queryResult = result;
            next();
        });
    },
    function(req, res){
        //console.log(req.queryResult.rows);
        res.json(req.queryResult.rows);

    });

app.post('/notifications',
    //connectToDb,
    function(req, res, next){
        // console.log(req.user);
        // console.log('updating notifications status...')
        // console.log(req.body);
        var actionTime = moment().format('YYYY-MM-DD HH:mm:ss');

        //console.log(req.body);
        var queryString = "UPDATE notifications " +
                                "SET status = '" + req.body.notification.status + "'," +
                                    "action_time = '" + actionTime +
                                    "' WHERE notificationid = " + req.body.notification.notificationid ;
        //console.log(queryString);

        req.db.client.query(queryString, function(err, result){
            // console.log('result: ');
            // console.log(result);
            // console.log('err: ');
            // console.log(err);
            next();
        });
    },
    function(req, res){
        res.send(200);
    });

    // -- "userid" int4 NOT NULL,
    // -- "recipientid" int4 NOT NULL,
    // -- "chemistry" bool,
    // -- "conversation" bool,
    // -- "goals" bool,
    // -- "personality" bool,
    // -- "text_reason" varchar(140)

app.post('/survey',
    function(req, res, next){

        console.log(req.body);

        var queryString = "INSERT INTO removesurvey (userid, recipientid, chemistry, conversation, goals, personality, different, text_reason) " +
                                "VALUES ("+ req.body.dancecard.userid +"," +
                                            req.body.dancecard.partnerid + ",'" +
                                            req.body.survey.chemistry + "','" +
                                            req.body.survey.conversation + "','" +
                                            req.body.survey.goals + "','" +
                                            req.body.survey.personality + "','" +
                                            req.body.survey.different + "','" +
                                            replaceAll("'", "''", req.body.survey.textReason) + "')";
        console.log(queryString);

        req.db.client.query(queryString, function(err, result){
            console.log('result: ');
            console.log(result);
            console.log('err: ');
            console.log(err);
            next();
        });
    },
    function(req, res){
        res.send(200);
    });

app.get('/dancecard/:userId',
    //connectToDb,
    function(req, res, next){
        req.userid = req.params.userId;
        // console.log('getting dancecard for ... ');
        // console.log(req.userid);
        next();
    },
    getDancecardById,
    function(req, res, next){
        for(var i=0; i<req.queryResult.rows.length; i++){
            var age = calculateAge(req.queryResult.rows[i].date_of_birth);
            req.queryResult.rows[i].age = age;
            req.queryResult.rows[i].in_dancecard = true;
            // req.queryResult.rows[i].mutual = checkMutual(req, req.queryResult.rows[i].userid, req.userid);
        }
        next();
    },
    function(req, res){
        // console.log('dancecard data...');
        // console.log(req.queryResult.rows);
        res.json(req.queryResult.rows);
    });

app.get('/dancecard/interested/:userId',
    //connectToDb,
    function(req, res, next){
        req.userid = req.params.userId;
        // console.log('getting dancecard for ... ');
        // console.log(req.userid);
        next();
    },
    getInterestedPeopleById,
    function(req, res){
        // console.log('Your on these folds dancecard... data...');
        // console.log(req.queryResult.rows);
        res.json(req.queryResult.rows);
    });

function getInterestedPeopleById(req, res, next){

        var queryString = "SELECT userid " +
                            "FROM danceCard "+
                            "WHERE partnerid =" + req.userid + " AND "+
                                  "status = 'added' AND mutual = 'false'";

        req.db.client.query(queryString, function(err, result){
                    req.queryResult = result;
                    //console.log(req.queryResult);
                    next();
                  });
    }

function getDancecardById(req, res, next){

        //gets full profile of all memebers in dancecard
        var queryString = "SELECT users.userId," +
                                    "users.dateofbirth as date_of_birth,"+
                                    "users.username,"+
                                    "users.location_city,"+
                                    "users.location_state,"+
                                    "users.personal_blurb,"+
                                    // "users.imageurls,"+
                                    // "users.medimageurls,"+
                                    "users.smallimageurls[1] as image_url,"+
                                    "users.logged_in,"+
                                    "danceCard.mutual "+
                            "FROM users,"+
                                 "danceCard "+
                            "WHERE danceCard.userId =" + req.userid + " AND "+
                                  "danceCard.status != 'removed' AND "+
                                  "users.userId=danceCard.partnerId " +
                            "ORDER BY updatetime ASC";

        //gets userid and status of memebers in dancecard
        // var queryString = "SELECT partnerid,"
        //                          "status "+
        //                  "FROM dancecard "+
        //                  "WHERE userid =" + userId + " AND "+
        //                        "status != 'removed'";

        // console.log('get dancecard peeps: ');
        // console.log(queryString);

        req.db.client.query(queryString, function(err, result){
                    req.queryResult = result;
                    //console.log(req.queryResult);
                    next();
                  });
    }

app.post('/dancecard',
    //connectToDb,
    function(req, res, next){
        req.dancecard = req.body;

        next();
        //if entry.status == remove -> send notification to removed user;
        //if entry.status == add
            //if responding to add ->
            //else -> send notification to added user;
        //if entry.status == mutual -> ??

    },
    // verifyDanceCardParameters(),
    addToDanceCard,
    updateDanceCardStatus,
    // checkMutualDancecard,
    function(req, res){
        res.redirect('/dancecard/'+req.dancecard.userid);
    });


// function isMutual(req, res, next){
//  SELECT (partnerid, status) FROM dancecard WHERE partnerid=req.dancecard.userid;
// }

function addToDanceCard(req,res,next) {
    var addTime = moment().format('YYYY-MM-DD HH:mm:ss');
    var queryString = "INSERT INTO danceCard "+
                          "(userId, partnerId, status, user_reason, updatetime) " +
                       "VALUES (" + req.dancecard.userid + "," +
                                    req.dancecard.partnerid  + ",'" +
                                    req.dancecard.status + "'," +
                                    "'','" +
                                    addTime + "')";

        console.log('*********** adding user to dancecard ... *********************');
        console.log(queryString);
        req.db.client.query(queryString, function(err, result){
            //deal with error
            req.update = err ? true : false;
            next();
        });
};

function updateDanceCardStatus(req,res,next) {
        if(req.update){
            var user_reason = req.dancecard.user_reason ? replaceAll("'", "''", req.dancecard.user_reason) : '';
            var updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            var queryString = "UPDATE danceCard "+
                                  "SET status = '"+ req.dancecard.status +"'," +
                                        "updatetime = '" + updateTime + "' ," +
                                        "user_reason = '" + user_reason +
                                  "' WHERE userid = " + req.dancecard.userid +
                                  " AND partnerid = " + req.dancecard.partnerid;
                console.log(queryString);
                req.db.client.query(queryString, function(err, result){
                    //deal with error
                    console.log(err);
                    next();
                });
        }
        else{
            next();
        }
};

// function checkMutualDancecard(req, res, next) {
//  var queryString = "SELECT check_mutual(" + req.dancecard.userid + "," + req.dancecard.partnerid + ")";
//  // console.log("I'm checking for mutuality...");
//  // console.log(queryString);
//  req.db.client.query(queryString, function(err, result){
//      // console.log(result.rows);
//      next();
//  });
// }

function verifyDanceCardParameters(req,res,next) {
        console.log(req.dancecard);
        if(req.dancecard.status && req.dancecard.userid && req.dancecard.partnerid){
            req.dancecard.status = "'" + req.dancecard.status + "'";
            req.dancecard.userid = parseInt(req.dancecard.userid, 10);
            req.dancecard.partnerid = parseInt(req.dancecard.partnerid, 10);
            // console.log('all checked out, error is elsewhere');
            next();
        }
        else{
            // console.log('what happened?');
            res.send(500);
        }
}

app.get('/profile/:userid',
    //connectToDb,
    function(req, res, next){

        var userid = req.params.userid;

        var queryString = "SELECT userid, username, dateofbirth," +
                            "location_city, location_state, personal_blurb, "+
                            "imageurls, medimageurls, smallimageurls, (SELECT count(*) from dancecard where userid=" + userid + " AND status='added') AS dancecard_count, logged_in "+
                            "FROM users "+
                            "WHERE userid=" + userid;
        req.db.client.query(queryString, function(err, result){

            req.queryResult = result;
            next();
        });
    },
    function (req, res) {
        //console.log(req.queryResult);
        var age = calculateAge(req.queryResult.rows[0].dateofbirth);
        req.queryResult.rows[0].age = age;
        res.json(req.queryResult.rows);

    });

app.get('/crowd/',
    //connectToDb,
    function(req, res, next){

        console.log('getting crowd for page....');
        console.log(req.query);
        console.log(req.user);
        req.type = req.query.type ? req.query.type : 'url';
        req.url = req.query.url ? req.query.url : 'www.google.com';
        req.userid = req.query.userid ? req.query.userid : req.user.userid;
        req.limit = req.query.limit ? req.query.limit : 10;
        // console.log('************************** PAGE PROFILES *******************************');
        // console.log(req.query.pageprofiles);
        req.pageProfiles = req.query.pageprofiles ? req.query.pageprofiles.split(',') : [];
        // console.log(req.pageProfiles);
        // if(req.query.pageprofiles){
        //  req.pageprofiles = req.query.pageprofiles.split(',');
        // }
        next();
        // console.log('get request /crowd/' + url);
    },
    getDancecardRecord,
    // getPeopleOnPage,
    getPrimaryPeopleOnPage,
    getSecondaryPeopleOnPage,
    function (req, res) {
        //console.log(req.queryResult);
        if(req.pagePeople){
            for(var i=0; i<req.pagePeople.length; i++){
                var age = calculateAge(req.pagePeople[i].dateofbirth);
                req.pagePeople[i].age = age;
            }
            res.json(req.pagePeople);
        }
        else {
            res.send(500);
        }
    });

function getDancecardRecord(req, res, next){

        //gets entire dancecard record for signed in user
        var queryString = "SELECT users.userId " +
                            "FROM users,"+
                                 "dancecard "+
                            "WHERE dancecard.userId =" + req.userid + " AND "+
                                  "users.userId=dancecard.partnerId";
        // console.log('get entire dancecard record: ');
        // console.log(queryString);
        req.db.client.query(queryString, function(err, result){
                    req.excludeUser = result.rows;
                    // console.log(req.queryResult);
                    next();
                  });
    }

function getPeopleOnPage(req,res,next) {

    var whereClause = " u.userid != " + req.userid;

    // console.log(req.userid);
    // console.log('result of querying dancecard record...');
    // console.log(req.queryResult);
    for(var i=0; i<req.excludeUser.length; i++){
        whereClause += " AND u.userid !=" + req.excludeUser[i].userid;
    }

    if(req.pageProfiles){
        for(i=0; i<req.pageProfiles.length; i++){
            whereClause += " AND u.userid !=" + req.pageProfiles[i];
        }
    }

    // By URL
    // WHERE userhistory.urlid = (SELECT urlid FROM urls WHERE url=req.url)
    var queryString = "SELECT  u.userid, u.username, u.dateofbirth, " +
                        "u.location_city, u.location_state, u.zipcode, u.personal_blurb, "+
                        "u.imageurls, u.medimageurls, u.smallimageurls, (SELECT count(*) from dancecard where userid=u.userid AND status='added') AS dancecard_count, "+
                        "1 AS relevance, u.logged_in " +
                          "FROM users u, user_history h WHERE u.userid = h.userid AND h.urlid = (SELECT urlid FROM urls WHERE url = '" + req.url + "') AND ("  + whereClause +
                          ") LIMIT " + req.limit;

        // console.log(queryString);
        req.db.client.query(queryString, function(err, result){
            //deal with error
            console.log(result);
            if(!err){
                req.pagePeople = result.rows;
            }
            next();
        });
    }

    function getSecondaryPeopleOnPage(req,res,next) {

    var newLimit = req.limit - req.pagePeople.length;
    // By URL
    // WHERE userhistory.urlid = (SELECT urlid FROM urls WHERE url=req.url)
    var queryString = "SELECT  u.userid, u.username, u.dateofbirth, " +
                        "u.location_city, u.location_state, u.zipcode, u.personal_blurb, "+
                        "u.imageurls, u.medimageurls, u.smallimageurls, (SELECT count(*) from dancecard where userid=u.userid AND status='added') AS dancecard_count, "+
                        "2 AS relevance, u.logged_in " +
                          "FROM getSecondaryUsers(" + req.userid + ") u, user_history h WHERE u.userid = h.userid AND h.urlid = (SELECT urlid FROM urls WHERE url = '" + req.url + "') AND ("  + req.whereClause +
                          ") ORDER BY u.userid DESC LIMIT " + newLimit;

        console.log('*********************** GETTING SECONDARY USERS ***************************');
        console.log(queryString);
        req.db.client.query(queryString, function(err, result){
            //deal with error
            console.log(result);
            if(!err){
                req.pagePeople = req.pagePeople.concat(result.rows);
            }
            next();
        });
    }

function getPrimaryPeopleOnPage(req,res,next) {

    var whereClause = " u.userid != " + req.userid;
    var primaryLimit = Math.round(req.limit*0.7);

    // console.log(req.userid);
    // console.log('result of querying dancecard record...');
    // console.log(req.queryResult);
    for(var i=0; i<req.excludeUser.length; i++){
        whereClause += " AND u.userid !=" + req.excludeUser[i].userid;
    }

    if(req.pageProfiles){
        for(i=0; i<req.pageProfiles.length; i++){
            whereClause += " AND u.userid !=" + req.pageProfiles[i];
        }
    }

    req.whereClause = whereClause;
    // By URL
    // WHERE userhistory.urlid = (SELECT urlid FROM urls WHERE url=req.url)
    var queryString = "SELECT  u.userid, u.username, u.dateofbirth, " +
                        "u.location_city, u.location_state, u.zipcode, u.personal_blurb, "+
                        "u.imageurls, u.medimageurls, u.smallimageurls, (SELECT count(*) from dancecard where userid=u.userid AND status='added') AS dancecard_count, "+
                        "1 AS relevance, u.logged_in " +
                          "FROM getPrimaryUsers(" + req.userid + ") u, user_history h WHERE u.userid = h.userid AND h.urlid = (SELECT urlid FROM urls WHERE url = '" + req.url + "') AND ("  + whereClause +
                          ") ORDER BY u.userid DESC LIMIT " + primaryLimit;

        console.log('*********************** GETTING PRIMARY USERS ***************************');
        console.log(queryString);
        req.db.client.query(queryString, function(err, result){
            //deal with error
            console.log(result);
            if(!err){
                req.pagePeople = result.rows;
            }
            next();
        });
    }

function calculateAge(dob){
    var today = moment();
    var birthdate = moment(dob);

    return today.diff(birthdate, 'years');
}

function getCityStateFromZipcode(zipcode, callback){
    var query = {
            zip: zipcode,
            country: 'US'
        };
    ziptastic(query).then(function(location){
        // console.log(location);
        callback(location);
    });
}

app.get('/shared-interest/:userid/:userid2', function(req, res){
    var userid = req.params.userid;
    var userid2 = req.params.userid2;

    var queryString = "select urls.urlid, urls.url, urls.page_title, " +
        "urls.primary_img_url, urls.embed_url, urls.embed_attr from " +
        "(select urlid from user_history where userid = '" + userid + "') as t0 " +
        "join (select urlid from user_history where userid = '" + userid2 + "') as t1 " +
        "on t0.urlid = t1.urlid join urls on t0.urlid = urls.urlid";

    // console.log(queryString);
    req.db.client.query(queryString, function(err, result){
            //deal with error
            // console.log(result);
            // console.log(err);
            if(err){
                res.send(500);
            }
            else{
            // res.send(200);
                res.json(result.rows);
            }

        });
});


app.get('/interest/:userid', function(req, res){
    var userid = req.params.userid;

    var queryString = "SELECT u.username, c.level1, c.level2, SUM (c.score * h.visit_count) as interest_score " +
                      "FROM users u, url_categories c, user_history h WHERE u.userid =" + userid + " AND " +
                             "u.userid = h.userid AND h.urlid=c.urlid GROUP BY u.username, c.level1, c.level2 ORDER BY c.level1";

    // console.log(queryString);
    req.db.client.query(queryString, function(err, result){
            //deal with error
            // console.log(result);
            // console.log(err);
            if(err){
                res.send(500);
            }
            else{
            // res.send(200);
                res.json(formatForTreemap(result.rows));
            }

        });
});

var COLOR_BY_CAT = {
    "religion and spirituality": "#c21617",
    "science":                   "#d42819",
    "news":                      "#eb401d",
    "health and fitness":        "#fd521f",
    "hobbies and interests":     "#fe7516",
    "food and drink":            "#fea309",
    "travel":                    "#ffc600",
    "art and entertainment":     "#b5b31a",
    "pets":                      "#549b3c",
    "home and garden":           "#0a8856",
    "family and parenting":      "#067e6a",
    "real estate":               "#02747f",
    "finance":                   "#006f89",
    "business and industrial":   "#305f83",
    "law, govt and politics":    "#704b7b",
    "sports":                    "#a03b75",
    "style and fashion":         "#9a3659",
    "shopping":                  "#932f33",
    "society":                   "#8d2a17",
    "education":                 "#702819",
    "careers":                   "#4a261c",
    "technology and computing":  "#2d241e",
    "automotive and vehicles":   "#4b4540"
};



function formatForTreemap(data){
    var treemapData = {};
    treemapData.name = "Browsing History Not Available";
    treemapData.value = 1;
    treemapData.color = "#ddd";
    treemapData.children = [];

    var level1 = {};
    var rootValue = 0;
    var parentValue = 0;
    var previousLevel1 = {level1: "", index: null};
    for(var i=0; i<data.length; i++){
        treemapData.value += parseFloat(data[i].interest_score);

        if(previousLevel1.level1 != data[i].level1){
            previousLevel1.level1 = data[i].level1;
            previousLevel1.index = treemapData.children.push({name: data[i].level1, value: 0, color: COLOR_BY_CAT[data[i].level1], children: []}) -1;
        }

        var nameLevel2 = data[i].level2.length > 3 ? data[i].level2 : data[i].level1;
        treemapData.children[previousLevel1.index].value += parseFloat(data[i].interest_score);
        treemapData.children[previousLevel1.index].children.push({name: nameLevel2, value: data[i].interest_score, color: COLOR_BY_CAT[data[i].level1]});
    }
    return treemapData;
}

app.get('/mockhistory/:userid', function(req, res){
    // console.log(__dirname);
    var userid = req.params.userid;
    // console.log(userid);
    var history;
    fs.readFile( __dirname + '/mockHistory.json', 'utf8', function (err, data) {
      // if (err) throw err;
      if(err){
        console.log(err);
      }
      else {
      history = JSON.parse(data);
      // console.log(history);
        // res.json(history);
        var promises = [];
        for(var i=0; i<history.length; i++){
            url = history[i].url;
            title = history[i].title;
            totalCount = history[i].typedCount + history[i].visitCount;
            visitTime = moment(history[i].lastVisitTime).format('YYYY-MM-DD HH:mm:ss');

                // promises.push(setUrlsAndCategories(req, url, title, totalCount, visitTime));
                promises.push(processOne(req, userid, url, title, totalCount, visitTime));
          }

          q.all(promises).then(function(data){
            res.send(200);
          },
          function(err){
            res.send(500);
          });

        }
    });

});


app.post('/history', function(req, res){
  console.log(req.body);      // your JSON
  var userid = req.body.userid;
  var history = req.body.history;
  var totalCount = 0;
  var url = '';
  var promises = [];

  for(var i=0; i<history.length; i++){
    url = history[i].url;
    title = history[i].title;
    totalCount = history[i].typedCount + history[i].visitCount;
    visitTime = moment(history[i].lastVisitTime).format('YYYY-MM-DD HH:mm:ss');

        promises.push(processOne(req, userid, url, title, totalCount, visitTime));

    // SELECT processHistory(userid, url, )
    //IF URL already exists in urls table return urlid
    //  CHECK IF URL ID exists in the user_history table
    //      IF it exists:
    //          UPDATE record with new visitTime and add to count;
    //      ELSE
    //          INSERT record with urlid, userid, visittime and count
    //ELSE
    //  INSERT record into urls with (url, title)
    //  call alchemy api to get
    //      main image
    //      UPDATE urls with image with related urlid
    //
    //      FOR each taxonomy found with confidence > 0.5
    //          INSERT record into url_categories (urlid, level1...5, score)

  }

  q.all(promises).then(function(data){
    res.send(200);
  },
  function(err){
    res.send(500);
  });

});

function setUrlsAndCategories(req, url, title, totalCount, visitTime){

    return setUrl(req, url, title)
    .then(function(data){
        console.log('updated or inserted url into url table...');
        console.log(data);
        // console.log(req);
        return getAndSetUrlImage(url/*, data.urlid, data.action*/)
            .then(function(image_result){
                console.log('image finding a success...now update user_history...');
                console.log(image_result);
                // console.log(req);
                return addImageToUrls(req, data.urlid, image_result.image_url)
                    .then(function(){
                            if(data.action == 'insert'){
                                return taxonomy(data.urlid, url)
                                    .then(function(taxonomyByUrlid){
                                        return setUrlCategories(req, taxonomyByUrlid);
                                    });
                            }
                    });
            });
    })
    .then(function(){
        console.log('added or updated url record and categories...');
    })
    .fail(function(err){
        console.log('Error...');
        console.log(err);
    });
}

function processOne(req, userid, url, title, totalCount, visitTime){

    return setUrl(req, url, title)
    .then(function(data){
        console.log('updated or inserted url into url table...');
        console.log(data);
        // console.log(req);
        return getAndSetUrlImage(url/*, data.urlid, data.action*/)
            .then(function(image_result){
                console.log('image finding a success...now update user_history...');
                console.log(image_result);
                // console.log(req);
                return addImageToUrls(req, data.urlid, image_result.image_url)
                    .then(function(){
                        return addUrlToUserHistory(req, data.urlid, data.action, userid, totalCount, visitTime)
                            .then(function(){
                                if(data.action == 'insert'){
                                    return taxonomy(data.urlid, url)
                                        .then(function(taxonomyByUrlid){
                                            return setUrlCategories(req, taxonomyByUrlid);
                                        });
                                }
                            });
                    });
            });
    })
    .then(function(){
        console.log('added or updated url record in user_history...');
    })
    .fail(function(err){
        console.log('Error...');
        console.log(err);
    });
}

function setUrl(req, url, title){
    var deferred = q.defer();
    var queryString = "UPDATE urls SET url='" + url + "', page_title='" + title + "'" +
                      " WHERE url='" + url + "' RETURNING urlid, (SELECT 'update' AS action); " +
                      " INSERT INTO urls (url, page_title) " +
                      "SELECT '" + url + "', '" + title + "' " +
                      "WHERE NOT EXISTS (SELECT 1 FROM urls WHERE url='" + url + "') "+
                      " RETURNING urlid, (SELECT 'insert' AS action);";

        // console.log(queryString);
        req.db.client.query(queryString, function(err, result){
            if(err) deferred.reject(err);
            else deferred.resolve(result.rows[0]);
        });
        return deferred.promise;
}

function addUrlToUserHistory(req, urlid, urlaction, userid, count, visitTime){
    var deferred = q.defer();
    var queryString = "UPDATE user_history SET visit_count= visit_count + " + count + ", last_visit ='" + visitTime + "'" +
                      " WHERE urlid='" + urlid + "' RETURNING urlid, (SELECT '"+ urlaction+"' AS action); " +
                      " INSERT INTO user_history (userid, urlid, visit_count, last_visit) " +
                      "SELECT " + userid + ", " + urlid + ", " + count + ", '" + visitTime + "' " +
                      "WHERE NOT EXISTS (SELECT 1 FROM user_history WHERE urlid=" + urlid + " AND userid=" + userid + ") " +
                      "RETURNING urlid, (SELECT '"+ urlaction+"' AS action); ";

        // console.log(queryString);
        // console.log(req.db);
        req.db.client.query(queryString, function(err, result){
            if(err) deferred.reject(err);
            else deferred.resolve(result.rows[0]);
        });
        return deferred.promise;
}

// INSERT INTO table (column1, column2, …)
// VALUES
//     (value1, value2, …),
//     (value1, value2, …) ,...;

function setUrlCategories(req, taxonomies){
    var deferred = q.defer();

    console.log(taxonomies);
        var queryString = "INSERT INTO url_categories (urlid, level1, level2, level3, level4, level5, score) " +
                          "VALUES ";

        var numLevels = 0;
        for(var i=0; i<taxonomies.taxonomy.length; i++){

            queryString += "(" + taxonomies.urlid + ",";
            for(var j=0; j<5; j++){
                numLevels = taxonomies.taxonomy[i].levels.length;
                if(j < numLevels){
                    queryString += "'" + taxonomies.taxonomy[i].levels[j] + "'";
                }
                else{
                    queryString += "''";
                }

                    queryString += ",";

            }
            queryString += taxonomies.taxonomy[i].score + ")";
            if(i != taxonomies.taxonomy.length-1){
                queryString += ",";
            }
        }
            // console.log(queryString);
            // console.log(req.db);
            req.db.client.query(queryString, function(err, result){
                if(err) deferred.reject(err);
                else deferred.resolve(result.rows);
            });

    return deferred.promise;
}

function taxonomy(urlid, url) {
    var deferred = q.defer();
    var categoriesByUrlid = {};
    alchemyapi.taxonomy('url', url, {}, function(response) {
        // console.log(response);
        categoriesByUrlid.urlid = urlid;
        categoriesByUrlid.taxonomy = [];
        var levels;
        var temp;
        for(var i=0; i<response.taxonomy.length; i++){
            levels = response.taxonomy[i].label.substring(1, response.taxonomy[i].label.length).split('/');
            categoriesByUrlid.taxonomy.push({score: response.taxonomy[i].score,
                                             levels: levels});
        }
        // console.log(categoriesByUrlid);
        deferred.resolve(categoriesByUrlid);
        // output['taxonomy'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
    });
    return deferred.promise;
}


function getAndSetUrlImage(url /*, urlid, urlaction */){
    var deferred = q.defer();
    alchemyapi.image('url', url, {}, function(response) {
        // output['image'] = { url:url, response:JSON.stringify(response,null,4), results:response };
        // res.render('example',output);
        deferred.resolve({image_url: response.image});
        console.log('returned from image....');
        console.log(response.image);
    });
    return deferred.promise;
}

function addImageToUrls(req, urlid, image_url){
    var deferred = q.defer();
    if (image_url !== ''){
        var queryString = "UPDATE urls SET  primary_img_url = '" + image_url + "'" +
                          " WHERE urlid=" + urlid;

            // console.log(queryString);
            // console.log(req.db);
            req.db.client.query(queryString, function(err, result){
                if(err) deferred.reject(err);
                else deferred.resolve(result.rows[0]);
            });
    }
    else{
        deferred.resolve();
    }
    return deferred.promise;
}


var users = {};

// io.sockets.on('connection', function(socket){

//     socket.emit('init', {socketid: socket.id});//

//     socket.on('register-user', function(data){
//         // users[data.userid] = {socket: socket.id};
//         console.log('registering...user...');
//         if(users[data.userid]){
//             delete users[data.userid];
//         }
//         users[data.userid] = { socket: socket.id };
//         console.log('registered user: ' + data.userid);
//         console.log(users);
//     });
//     // io.sockets.socket(users.userid.socket).emit()
//     socket.on('disconnect', function(){

//     });

// });

//     ee.on("message-added", function (data) {
//         console.log("event has occured: ");
//         console.log(data);
//         if(users[data.receiverid]){
//             io.sockets.socket(users[data.receiverid].socket).emit('new-message', data);
//         }
//     });

//     ee.on("new_notification", function (data) {
//         // console.log('all listeners for new_notification...');
//         // console.log(ee.listeners("new_notification"))
//   //    console.log("new_notification event has occured: ");
//   //    console.log(data);
//         var fields = data.payload.split(',');
//         console.log(fields);
//         var userid = fields[0];
//         var notification = {
//             userid: userid,
//             notificationid: fields[1],
//             about_userid: fields[2],
//             message: fields[3],
//             extra_message: fields[4],
//             action_time: fields[5],
//             type: fields[6],
//             subtype: fields[7],
//             status: fields[8],
//             imgurl: fields[9],
//         };

//         console.log('in socket io message...event new_notification');
//         console.log('users[userid] = ' + users[userid] );
//         console.log(users[userid]);
//         console.log(users);
//         if(users[userid]){
//             console.log('all systems go...sending message off to sbe..');
//             io.sockets.socket(users[userid].socket).emit('new-notification', notification);
//         }
//     });


