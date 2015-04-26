var imagesBasePath = __dirname + '/static/images/';

var express = require('express');
var app = express();

var q = require('q');
var fs = require('fs');
var moment = require('moment');

var ziptastic = require('ziptastic');
var im = require('imagemagick');

//Create the AlchemyAPI object
var AlchemyAPI = require('./alchemyapi');
var alchemyapi = new AlchemyAPI();

var https = require('https');
var http = require('http');

//Modules for using node events
var events = require("events");
var EventEmitter = events.EventEmitter;
var ee = new EventEmitter();

var pkey = fs.readFileSync('key.pem');
var pcert = fs.readFileSync('cert.pem');

var options = {
    key: pkey,
    cert: pcert
};

var server = http.createServer(app);
var secureServer = https.createServer(options, app);

var PORT = process.env.PORT || 3001;
var SECURE_PORT = 8443;

server.listen(PORT);
secureServer.listen(SECURE_PORT);

var io = require('socket.io').listen(secureServer);

console.log("server listening at port " + PORT);
console.log("secure server listening at port " + SECURE_PORT);

// //Database modules for working with postgresql
var pg = require('pg');
var pgclient = require('connect-pgclient');

var dbConfigObj = {};
if (process.env.DATABASE_URL) {
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

var pgConnectionString = process.env.DATABASE_URL || "postgres://sidebar:5432@localhost/sidebar";

//postgres://{user}:{pass}@some-ec2-instance:{port}/{db}
//"postgres:// dvybsfqqxhtvlt :ep3gKsF6uWa7qmnWKbM1_wWRIk @ec2-54-83-43-49.compute-1.amazonaws.com: 5432 /d5ct0tand6bndq"
// console.log(process.env.DATABASE_URL);
// console.log(dbConfigObj);


var client = new pg.Client(pgConnectionString);
client.connect();
client.query('LISTEN "watchers"');
client.on('notification', function(data) {
    console.log('###################### notification received ######################');
    ee.emit('new_notification', data);
});


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var authConfig = {
    usernameField: 'email',//can be anything including email
    passwordField: 'password',
    passReqToCallback: true
};

passport.use('local-login', new LocalStrategy(authConfig,
  function(req, email, password, done) {
    // console.log(req.body);
    var queryString = "SELECT userid, password FROM users WHERE email='" + email + "'";

    // console.log(queryString);
    req.db.client.query(queryString, function (error, result) {
        // console.log(err);
        // console.log(result);
      if (error) {
        return done(error);
      }
      
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

passport.serializeUser(function(user, done) {
    // console.log('serialize user...')
    // console.log(user);
  done(null, user.userid);
});

passport.deserializeUser(function(req, userid, done) {
  var queryString = "SELECT (userid) FROM users WHERE userid=" + userid;

  req.db.client.query(queryString, function (error, result) {
    // console.log('deserialize user..');
    // console.log(result);
    done(error, result.rows[0]);
  });
});

// // function listenForNotifications(req, res, next) {
// //       req.db.client.on('notification', function(msg) {
// //            ee.emit('new_notification', msg);
// //       });
// //       var query = req.db.client.query("LISTEN watchers");
// //       next();
// // }

// //use this middleware for routes that require a user to be logged in/authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.send(403);
}

function allowCrossDomain(req, res, next) {
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
}

app.configure(function(){
  app.use(express.logger());
  app.use(express.static(__dirname + '/static/images'));
  app.use(express.static(__dirname + '/static/icons'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.json());
  app.use(express.urlencoded());
  // app.use(flash());
  app.use(connectToDb);
  // app.use(listenForNotifications);
  app.use(express.session({ secret: 'so secret'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(allowCrossDomain);
  app.use(app.router);
});


app.get('/', function (req, res) {
  res.send('hello world');
});

app.post('/signup', function (req, res, next) {
    var userData = req.body.user;
    var userPreferences = req.body.pref;

    q.all([
      createNewUser(req.db.client, userData),
      createNewUserPref(req.db.client, userPreferences)
    ])
      .then(function () {
        res.redirect('/login');
      })
      .fail(function () {
        res.send(404);
      });
    
  });


app.post('/upload',
    // passport.authenticate('local'),
    function (req, res) {
        var filePath = req.files.file.path;
        var filename = req.files.file.name;

        uploadImages(filePath, filename)
          .then(function (imagePaths) {
              res.json(imagePaths);
          }, function () {
              res.send(500);
          });
    });


app.post('/login',
    passport.authenticate('local-login'),
    function (req, res) {
        var userid = req.user.userid;
        var userProfile = null;

        login(req.db.client, userid)
          .then(function () {
              return getProfile(req.db.client, userid);
          })
          .then(function (selfProfile) {
              userProfile = selfProfile;
              return getUnreadNotifications(req.db.client, selfProfile.userid);
          })
          .then(function (unreadNotifications) {
              userProfile.unread_notifications = unreadNotifications;
              res.json(userProfile);
          })
          .fail(function (error) {
              res.send(304);
          });
    });


app.post('/logout',
    function (req, res) {
        var userid = req.body.userid || req.user.userid;

        console.log('@@@@@@@@@@@ logout ? @@@@@@@@@@');
        console.log(req.user);
        console.log(req.body);

        logout(req.db.client, userid)
          .then(function () {
            res.send(200);
          }, function () {
            res.send(304);
          });
    });

app.get('/authentication_status', function(req, res){
    if (req.user) {
        res.json({status: "logged_in", userid: req.user.userid});
    } else {
        res.json({status: 'logged_out'});
    }
});

app.get('/message/:partnerId',
    // ensureAuthenticated,
    function (req, res) {
        var userid = req.query.userId; //Can probably get from session req.user.userId;
        var partnerid = req.params.partnerId;

        getConversation(req.db.client, userid, partnerid)
          .then(function (conversation) {
            res.json(conversation);
          }, function () {
            res.send(304);
          });
    });

app.post('/message',
    function (req, res) {
        var senderid   = req.body.senderid;
        var receiverid = req.body.receiverid;
        var message    = req.body.message;

        addMessage(req.db.client, senderid, receiverid, message)
          .then(function (message) {
              // ee.emit('message-added', message);
              res.send(200);
          }, function () {
              res.send(304);
          });
    });

app.get('/notifications/:userid',
    function (req, res) {
        var userid = req.params.userid;

        getNotifications(req.db.client, userid)
          .then(function (notifications) {
              res.json(notifications);
          }, function () {
              res.send(304);
          });
    });

app.post('/notifications',
    function (req, res) {
        var notificationid = req.body.notification.notificationid;
        var status = req.body.notification.status;

        updateNotification(req.db.client, notificationid, status)
          .then(function () {
              res.send(200);
          }, function () {
              res.send(304);
          });
    });

app.post('/survey',
    function (req, res) {
        var surveyData = {
          userid:       req.body.userid,
          recipientid:  req.body.recipientid,
          chemistry:    req.body.chemistry,
          conversation: req.body.conversation,
          goals:        req.body.goals,
          personality:  req.body.personality,
          different:    req.body.different,
          text_reason:  req.body.textReason
        };

        logSurvey(req.db.client, surveyData)
          .then(function () {
              res.send(200);
          }, function () {
              res.send(304);
          });
    });

app.get('/dancecard/interested/:userId',
    function (req, res) {
      var userid = req.params.userId;

      getInterestedPeopleById(req.db.client, userid)
        .then(function (interestedPeople) {
          res.json(interestedPeople);
        },
        function () {
          res.send(304);
        });
    });

app.get('/dancecard/:userId',
    function (req, res) {
        var userid = req.params.userId;

        getDancecard(req.db.client, userid)
          .then(function (dancecard) {
            for (var i=0; i < dancecard.length; i++) {
                dancecard[i].age = calculateAge(dancecard[i].date_of_birth);
                dancecard[i].in_dancecard = true;
            }
            res.json(dancecard);
          },
          function () {
            res.send(304);
          });
    });

app.post('/dancecard',
    function (req, res) {
        var userid = req.body.userid;
        var partnerid = req.body.partnerid;

        addToDanceCard(req.db.client, userid, partnerid)
          .then(function (dancecard) {
            res.json(dancecard);
            //res.redirect('/dancecard/' + userid);
          },
          function () {
            res.send(304);
          });
    });

app.put('/dancecard',
  function (req, res) {
      var userid = req.body.userid;
      var partnerid = req.body.partnerid;
      var reason = req.body.user_reason;

      removeFromDancecard(req.db.client, userid, partnerid, reason)
        .then(function (dancecard) {
          res.json(dancecard);
          // res.redirect('/dancecard/' + userid);
        },
        function () {
          res.send(304);
        });
  });

app.get('/profile/:userid',
    function (req, res, next) {
        var userid = req.params.userid;

        getProfile(req.db.client, userid)
          .then(function (profile) {
            res.json(profile);
          },
          function () {
            res.send(304);
          });
    });

// https://localhost:8443/crowd/?url=https://www.google.com/&userid=23
app.get('/crowd/',
    function (req, res) {
        var url = req.query.url ? req.query.url : 'www.google.com';
        var userid = req.query.userid ? req.query.userid : req.user.userid;
        var pageProfiles = req.query.pageprofiles ? req.query.pageprofiles.split(',') : [];

        var MAX_USERS = 10;
        var limit = req.query.limit ? req.query.limit : MAX_USERS;
        
        getCrowd(req.db.client, userid, url, pageProfiles, limit)
          .then(function (crowd) {
              res.json(crowd);
          }, function () {
              res.send(304);
          });
    });

app.get('/shared-interest/:userid/:userid2', function (req, res) {
    var userid1 = req.params.userid;
    var userid2 = req.params.userid2;

    getSharedInterest(req.db.client, userid1, userid2)
      .then(function (sharedInterests) {
          res.json(sharedInterests);
      }, function () {
          res.send(304);
      });
});

app.get('/interest/:userid', function (req, res) {
    var userid = req.params.userid;

    getUsersInterests(req.db.client, userid)
        .then(function (interests) {
            res.json(interests);
        },
        function (error) {
            res.send(500);
        });
});

app.get('/mockhistory/:userid', function(req, res){
    var userid = req.params.userid;
    var history;

    fs.readFile( __dirname + '/mockHistory.json', 'utf8', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            history = JSON.parse(data);

            var promises = [];
            for (var i=0; i < history.length; i++) {
                url = history[i].url;
                title = history[i].title;
                totalCount = history[i].typedCount + history[i].visitCount;
                visitTime = moment(history[i].lastVisitTime).format('YYYY-MM-DD HH:mm:ss');

                // promises.push(setUrlsAndCategories(req.db.client, url, title, totalCount, visitTime));
                promises.push(processOne(req.db.client, userid, url, title, totalCount, visitTime));
            }

            q.all(promises).then(function (data) {
                res.send(200);
            },
            function(error){
                res.send(500);
            });
        }
    });
});


app.post('/history', function(req, res){
  var userid = req.body.userid;
  var history = req.body.history;
  var totalCount = 0;
  var url = '';
  var promises = [];

  for (var i=0; i < history.length; i++) {
        url = history[i].url;
        title = history[i].title;
        totalCount = history[i].typedCount + history[i].visitCount;
        visitTime = moment(history[i].lastVisitTime).format('YYYY-MM-DD HH:mm:ss');

        promises.push(processOne(req.db.client, userid, url, title, totalCount, visitTime));

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

  q.all(promises).then(function (data) {
      res.send(200);
  },
  function(error){
      res.send(500);
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

function setUrlsAndCategories(dbClient, url, title, totalCount, visitTime){

    return setUrl(dbClient, url, title)
                .then(function(data){
                    return getAndSetUrlImage(url);
                })
                .then(function(image_result){
                    return addImageToUrls(dbClient, data.urlid, image_result.image_url);
                })
                .then(function() {
                    if (data.action == 'insert'){
                        return taxonomy(data.urlid, url)
                                    .then(function(taxonomyByUrlid){
                                        return setUrlCategories(dbClient, taxonomyByUrlid);
                                    });
                    }
                })
                .then(function(){
                    console.log('added or updated url record and categories...');
                })
                .fail(function(err){
                    console.log('Error...');
                    console.log(err);
                });
}

function processOne(dbClient, userid, url, title, totalCount, visitTime){

    return setUrl(dbClient, url, title)
                .then(function (data) {
                    return getAndSetUrlImage(url);
                })
                .then(function (image_result) {
                    return addImageToUrls(dbClient, data.urlid, image_result.image_url);
                })
                .then(function () {
                    return addUrlToUserHistory(dbClient, data.urlid, data.action, userid, totalCount, visitTime);
                })
                .then(function () {
                    if (data.action === 'insert') {
                        return taxonomy(data.urlid, url)
                                  .then(function(taxonomyByUrlid){
                                      return setUrlCategories(dbClient, taxonomyByUrlid);
                                  });
                    }
                })
                .then(function(){
                    console.log('added or updated url record in user_history...');
                })
                .fail(function(err){
                    console.log('Error...');
                    console.log(err);
                });
}

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

    for (var i=0; i < data.length; i++) {
        treemapData.value += parseFloat(data[i].interest_score);

        if (previousLevel1.level1 !== data[i].level1) {
            previousLevel1.level1 = data[i].level1;
            previousLevel1.index = treemapData.children.push({
                name: data[i].level1,
                value: 0,
                color: COLOR_BY_CAT[data[i].level1],
                children: []
            }) -1;
        }

        var nameLevel2 = data[i].level2.length > 3 ? data[i].level2 : data[i].level1;
        treemapData.children[previousLevel1.index].value += parseFloat(data[i].interest_score);
        treemapData.children[previousLevel1.index].children.push({
            name: nameLevel2,
            value: data[i].interest_score,
            color: COLOR_BY_CAT[data[i].level1]
        });
    }
    
    return treemapData;
}

function setUrl(dbClient, url, title){
    var D = q.defer();

    var queryString = "UPDATE urls SET url='" + url + "', page_title='" + title + "'" +
                      " WHERE url='" + url + "' RETURNING urlid, (SELECT 'update' AS action); " +
                      " INSERT INTO urls (url, page_title) " +
                      "SELECT '" + url + "', '" + title + "' " +
                      "WHERE NOT EXISTS (SELECT 1 FROM urls WHERE url='" + url + "') "+
                      " RETURNING urlid, (SELECT 'insert' AS action);";

        // console.log(queryString);
        dbClient.query(queryString, function (error, result) {
            if (error) {
                D.reject(error);
            } else {
              D.resolve(result.rows[0]);
            }
        });

        return D.promise;
}

function addUrlToUserHistory(req, urlid, urlaction, userid, count, visitTime){
    var D = q.defer();

    var queryString = "UPDATE user_history SET visit_count= visit_count + " + count + ", last_visit ='" + visitTime + "'" +
                      " WHERE urlid='" + urlid + "' RETURNING urlid, (SELECT '"+ urlaction+"' AS action); " +
                      " INSERT INTO user_history (userid, urlid, visit_count, last_visit) " +
                      "SELECT " + userid + ", " + urlid + ", " + count + ", '" + visitTime + "' " +
                      "WHERE NOT EXISTS (SELECT 1 FROM user_history WHERE urlid=" + urlid + " AND userid=" + userid + ") " +
                      "RETURNING urlid, (SELECT '"+ urlaction+"' AS action); ";

    dbClient.query(queryString, function (error, result) {
        if (error) {
            D.reject(error);
        } else {
            D.resolve(result.rows[0]);
        }
    });

    return D.promise;
}

function setUrlCategories(dbClient, taxonomies){
    var D = q.defer();

    console.log(taxonomies);
    var queryString = "INSERT INTO url_categories (urlid, level1, level2, level3, level4, level5, score) " +
                      "VALUES ";

    var numLevels = 0;
    for (var i=0; i<taxonomies.taxonomy.length; i++) {

        queryString += "(" + taxonomies.urlid + ",";
        for (var j=0; j < 5; j++) {
            numLevels = taxonomies.taxonomy[i].levels.length;
            if (j < numLevels) {
                queryString += "'" + taxonomies.taxonomy[i].levels[j] + "'";
            } else {
                queryString += "''";
            }

            queryString += ",";
        }

        queryString += taxonomies.taxonomy[i].score + ")";
        if (i !== taxonomies.taxonomy.length-1) {
            queryString += ",";
        }
    }

    dbClient.query(queryString, function (error, result) {
        if (error) {
            D.reject(error);
        } else {
            D.resolve(result.rows);
        }
    });

    return D.promise;
}

function taxonomy(urlid, url) {
    var D = q.defer();
    var categoriesByUrlid = {};
    var levels;
    var temp;

    alchemyapi.taxonomy('url', url, {}, function(response) {
        // console.log(response);
        categoriesByUrlid.urlid = urlid;
        categoriesByUrlid.taxonomy = [];

        for (var i=0; i < response.taxonomy.length; i++) {
            levels = response.taxonomy[i].label.substring(1, response.taxonomy[i].label.length).split('/');
            categoriesByUrlid.taxonomy.push({
                score: response.taxonomy[i].score,
                levels: levels
            });
        }
        // console.log(categoriesByUrlid);
        D.resolve(categoriesByUrlid);
        // output['taxonomy'] = { url:demo_url, response:JSON.stringify(response,null,4), results:response };
    });

    return D.promise;
}

function getAndSetUrlImage(url) {
    var D = q.defer();

    alchemyapi.image('url', url, {}, function(response) {
        // output['image'] = { url:url, response:JSON.stringify(response,null,4), results:response };
        // res.render('example',output);
        D.resolve({image_url: response.image});
        console.log('returned from image....');
        console.log(response.image);
    });

    return D.promise;
}

function addImageToUrls(dbClient, urlid, image_url){
    var D = q.defer();

    if (image_url !== ''){
        var queryString = "UPDATE urls SET  primary_img_url = '" + image_url + "'" +
                          " WHERE urlid=" + urlid;

        dbClient.query(queryString, function (error, result) {
            if (error) {
                D.reject(error);
            } else {
                D.resolve(result.rows[0]);
            }
        });
    } else {
        D.resolve();
    }

    return D.promise;
}

function getDancecard(dbClient, userid) {
    var D = q.defer();

    var queryString = "SELECT users.userId," +
                                "users.dateofbirth as date_of_birth," +
                                "users.username," +
                                "users.location_city," +
                                "users.location_state," +
                                "users.personal_blurb," +
                                "users.imageurls," +
                                // "users.medimageurls,"+
                                "users.smallimageurls[1] as image_url," +
                                "users.logged_in," +
                                "danceCard.mutual," +
                                "COALESCE (count.ct, 0) AS dancecard_count " +
                        "FROM users LEFT OUTER JOIN " + getDancecardCountQuery(userid) + " AS count " +
                             "ON (users.userid = count.userid), " +
                             "danceCard " +
                        "WHERE danceCard.userId =" + userid + " AND " +
                              "danceCard.status != 'removed' AND " +
                              "users.userId=danceCard.partnerId " +
                        "ORDER BY updatetime ASC";

    dbClient.query(queryString, function (error, result) {
      if (error) {
          D.reject(error);
      } else {
          D.resolve(result.rows);
      }
    });

    return D.promise;
}

function addToDanceCard(dbClient, userid, partnerid) {
    var D = q.defer();

    var addTime = moment().format('YYYY-MM-DD HH:mm:ss');
    var queryString = "INSERT INTO danceCard " +
                          "(userId, partnerId, status, user_reason, updatetime) " +
                       "VALUES (" + userid + "," +
                                    partnerid  + ",'added','','" +
                                    addTime + "')";

    dbClient.query(queryString, function(error, result) {
      if (error) {
          updateDancecard(dbClient, 'added', userid, partnerid)
            .then(function () {
                getDancecard(dbClient, userid)
                  .then(function (dancecard) {
                      D.resolve(dancecard);
                  }, function () {
                      D.reject();
                  });
            }, function (error) {
                D.reject(error);
            });
      } else {
        getDancecard(dbClient, userid)
          .then(function (dancecard) {
              D.resolve(dancecard);
          }, function (error) {
              D.reject(error);
          });
      }
    });

    return D.promise;
}

function removeFromDancecard(dbClient, userid, partnerid, reason) {
    return updateDancecard(dbClient, 'removed', userid, partnerid, reason);
}

function updateDancecard(dbClient, status, userid, partnerid, reason) {
    var D = q.defer();

    reason = reason ? replaceAll("'", "''", reason) : '';
    var updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    var queryString = "UPDATE danceCard "+
                          "SET status = '" + status + "'," +
                                "updatetime = '" + updateTime + "' ," +
                                "user_reason = '" + reason +
                          "' WHERE userid = " + userid +
                          " AND partnerid = " + partnerid;

    dbClient.query(queryString, function (error, result) {
        if (error) {
          D.reject(error);
        } else {
          getDancecard(dbClient, userid)
            .then(function (dancecard) {
                D.resolve(dancecard);
            }, function () {
                D.reject();
            });
        }
    });

    return D.promise;
}

function getDancecardCountQuery(userid) {
    return "(SELECT users.userid, count(*) AS ct " +
              "FROM users, dancecard " +
              "WHERE users.userid = dancecard.userid AND dancecard.status = 'added' " +
              "GROUP BY 1)";
}

function getProfile(dbClient, userid) {
    var D = q.defer();

    var queryString = "SELECT users.userid, users.username, users.dateofbirth," +
                              "users.location_city, users.location_state, users.personal_blurb, " +
                              "users.imageurls, users.medimageurls, users.smallimageurls, " +
                              "count.ct AS dancecard_count, " +
                              "users.logged_in " +
                      "FROM users, " +
                            getDancecardCountQuery(userid) + " AS count " +
                      "WHERE users.userid=" + userid + " AND users.userid=count.userid";

    dbClient.query(queryString, function (error, result) {
      if (error) {
        D.reject(error);
      } else {
        result.rows[0].age = calculateAge(result.rows[0].dateofbirth);
        D.resolve(result.rows[0]);
      }
    });

    return D.promise;
}

function getInterestedPeopleById(dbClient, userid) {
    var D = q.defer();

    var queryString = "SELECT userid " +
                        "FROM danceCard " +
                        "WHERE partnerid =" + userid + " AND "+
                              "status = 'added' AND mutual = 'false'";

    dbClient.query(queryString, function (error, result) {
      if (error) {
        D.reject(error);
      } else {
        D.resolve(result.rows);
      }
    });

    return D.promise;
}

function readInImage(srcPath, dstPath, filename) {
    var D = q.defer();

    fs.readFile(srcPath, function (error, imageData) {
        if (error) {
            D.reject(error);
        } else {
            fs.writeFile(dstPath, imageData, function (error) {
                if (error) {
                    D.reject(error);
                } else {
                    D.resolve();
                }
            });
        }
    });

    return D.promise;
}

function copyAndPrepImage(srcPath, dstPath, options) {
    var D = q.defer();

    function onImageProcessed(error, stdout, stderr) {
        if (error) {
            D.reject(error);
        } else {
            D.resolve();
        }
    }

    if (options.crop) {
        im.crop({
            srcPath: srcPath,
            dstPath: dstPath,
            width: options.height || options.width,
            height: options.height || options.width,
            quality: 100,
            gravity: 'Center',
        }, onImageProcessed);
    }

    if (options.resize) {
      im.resize({
          srcPath: srcPath,
          dstPath: dstPath,
          height: options.height
      }, onImageProcessed);
    }

    return D.promise;
}

function constructImagePath(basePath, size, filename) {
    return basePath + size + '_' + filename;
}

function constructAllImagePaths(sizes, filename) {
    var paths = [];

    sizes.forEach(function (size) {
        paths.push(constructImagePath(imagesBasePath, size, filename));
    });

    return paths;
}

function uploadImages(path, filename) {
    var D = q.defer();

    var sizes = ['orig', 'scaled', 'med', 'small'];
    var paths = constructAllImagePaths(sizes, filename);

    readInImage(path, paths[0], filename)
      .then(function () {
          copyAndPrepImage(paths[1], paths[2], {
              resize: true,
              height: 300
          });
      })
      .then(function () {
        copyAndPrepImage(paths[1], paths[2], imageData, {
          crop: true,
          height: 150
        });
      })
      .then(function () {
        copyAndPrepImage(paths[2], paths[3], imageData, {
          crop: true,
          height: 36
        });
      })
      .then(function () {
          D.resolve({
              origImageUrl: paths[0],
              medImageUrl: paths[1],
              smallImageUrl: paths[2]
          });
      })
      .fail(function (error) {
          D.reject(error);
      });

      return D.promise;
}

function createNewUser(dbClient, user) {
        var D = q.defer();

        user.dateofbirth = moment([user.dob_year, user.dob_month, user.dob_day]).format('YYYY-MM-DD');//'1982-11-27'

        var urls = serializeArrayForQuery(user.originalImageUrl);
        var medurls = serializeArrayForQuery(user.mediumImageUrl);
        var smallurls = serializeArrayForQuery(user.smallImageUrl);

        // getCityStateFromZipcode(user.zipcode, function(location) { can get this data from signup

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
                                          "smallimageurls," +
                                          "logged_in) " +
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

            dbClient.query(queryString, function(err, result) {

                if (error) {
                    D.reject(error);
                } else {
                    D.resolve(result.rows[0]);
                }
            });

            return D.promise;
}

function createNewUserPref(dbClient, preferences){
    var D = q.defer();

    var queryString = "INSERT INTO userprefs " +
                                "(userid," +
                                  "male," +
                                  "female," +
                                  "age_min," +
                                  "age_max," +
                                  "distance_max) " +
                           "VALUES (" + preferences.userid  + "," +
                                        preferences.male + "," +
                                        preferences.female + "," +
                                        preferences.age_min + "," +
                                        preferences.age_max + "," +
                                        preferences.distance_max + ") " +
                         "RETURNING *";
    // console.log(queryString);

    dbClient.query(queryString, function (error, result) {
        if (error) {
            D.reject(error);
        } else {
            D.resolve(result.rows[0]);
        }
    });

    return D.promise;
}

function login(dbClient, userid) {
    return auth(dbClient, userid, true);
}

function logout(dbClient, userid) {
    console.log('@@@@@@@@@@@@@ trying to logout user ' + userid + ' @@@@@@@@@');
    return auth(dbClient, userid, false);
}

function auth(dbClient, userid, login) {
    var D = q.defer();

    var logged_in = login ? 't' : 'f';
    var queryString = "UPDATE users " +
                        "SET logged_in = '" + logged_in + "' " +
                        "WHERE userid = " + userid;

    console.log(queryString);

    dbClient.query(queryString, function (error, result) {
      if (error) {
        D.reject(error);
      } else {
        D.resolve();
      }
    });

    return D.promise;
}

function getConversation(dbClient, userid1, userid2) {
    var D = q.defer();

    var queryString = "SELECT senderId, receiverId, message, sendTime " +
                        "FROM messages " +
                        "WHERE (senderId=" + userid1 + " AND receiverId=" + userid2 + ") OR "+
                            "(receiverId=" + userid1 + " AND senderId=" + userid2 + ")" +
                        "ORDER BY sendTime ASC";

    dbClient.query(queryString, function (error, result) {
      if (error) {
        D.reject(error);
      } else {
        D.resolve(result.rows);
      }
    });

    return D.promise;
}

function addMessage(dbClient, senderid, receiverid, message) {
    var D = q.defer();

    var sendTime = moment().format('YYYY-MM-DD HH:mm:ss');
    var queryString = "INSERT INTO messages " +
                            "(senderId, receiverId, message, sendTime) " +
                      "VALUES (" + senderid + "," + receiverid + ",'" + replaceAll("'", "''", message) + "','" + sendTime + "') " +
                      "RETURNING *";

    dbClient.query(queryString, function (error, result) {
        if (error) {
          D.reject(error);
        } else {
          D.resolve(result.rows[0]);
        }
    });

    return D.promise;
}

function getUnreadNotifications(dbClient, userid) {
    var D = q.defer();

    var queryString = "SELECT count(*) AS unread FROM notifications WHERE userid = " + userid + " AND status='unread'";

    dbClient.query(queryString, function (error, result) {
        if (error) {
          D.reject(error);
        } else {
          D.resolve(result.rows[0].unread);
        }
    });

    return D.promise;
}

function getNotifications(dbClient, userid) {
    var D = q.defer();

    var queryString = "SELECT t0.*, u.smallimageurls FROM " +
                        "(SELECT n.notificationid, n.userid, n.about_userid, n.message, n.extra_message, " +
                                "n.action_time, n.type, n.subtype, n.status " +
                        "FROM notifications n " +
                        "WHERE n.userid=" + userid +
                        "ORDER BY action_time DESC) AS t0 "+
                        "JOIN users u ON t0.about_userid=u.userid ORDER BY action_time DESC";

    dbClient.query(queryString, function (error, result) {
        if (error) {
          D.reject(304);
        } else {
          D.resolve(result.rows);
        }
    });

    return D.promise;
}

function updateNotification(dbClient, notificationid, status) {
    var D = q.defer();

    var actionTime = moment().format('YYYY-MM-DD HH:mm:ss');
    var queryString = "UPDATE notifications " +
                          "SET status = '" + status + "'," +
                              "action_time = '" + actionTime + "'" +
                          "WHERE notificationid = " + notificationid;

    dbClient.query(queryString, function (error, result) {
        if (error) {
          D.reject(error);
        } else {
          D.resolve();
        }
    });

    return D.promise;
}

function logSurvey(dbClient, surveyData) {
    var D = q.defer();

    var queryString = "INSERT INTO removesurvey (userid, recipientid, chemistry, conversation, goals, " +
                                   "personality, different, text_reason) " +
                              "VALUES ("+ surveyData.userid +"," +
                                          surveyData.recipientid + ",'" +
                                          surveyData.chemistry + "','" +
                                          surveyData.conversation + "','" +
                                          surveyData.goals + "','" +
                                          surveyData.personality + "','" +
                                          surveyData.different + "','" +
                                          replaceAll("'", "''", surveyData.text_reason) + "')";

    dbClient.query(queryString, function (error, result) {
        if (error) {
          D.reject(error);
        } else {
          D.resolve(result);
        }
    });

    return D.promise;
}

function getCrowd(dbClient, userid, url, pageProfiles, limit) {
    var first_limit = Math.round(limit * 0.6);
    var second_limit = 0;
    var users = {};
    var excluded;

    return getDancecard(dbClient, userid)
            .then(function (dancecard) {
                var usersToExclude = [userid].concat(pageProfiles);

                for (var i=0; i < dancecard.length; i++) {
                  usersToExclude.push(dancecard[i].userid);
                }
                excluded = usersToExclude;
                return usersToExclude;
            })
            .then(function (excludedUsers) {
                return getPeopleOnPage(dbClient, userid, url, excludedUsers, first_limit, false);
            })
            .then(function (innerCircleUsers) {
                users.primary = innerCircleUsers;
                var leftovers = first_limit - innerCircleUsers.length;
                second_limit = limit - first_limit + leftovers;

                return getPeopleOnPage(dbClient, userid, url, excluded, second_limit, true);
            })
            .then(function (fringeUsers) {
                users.fringes = fringeUsers;
                users.url = url;
                return users;
            })
            .fail(function (error) {
                return error;
            });
}

function getUrlIdQuery(url) {
    return "(SELECT urlid FROM urls WHERE url = '" + url + "')";
}

function excludeUsers(userids) {
    var whereClauseExclude = "(";

    for (var i=0; i < userids.length; i++) {
      whereClauseExclude += "u.userid !=" + userids[i];

      if (i < userids.length - 1) {
        whereClauseExclude += " AND ";
      }
    }

    return whereClauseExclude + ")";
}

function getPeopleOnPage(dbClient, userid, url, usersToExclude, limit, fringe) {
    var D = q.defer();

    var relevance, filter;

    if (fringe) {
        relevance = "2";
        filter = "getSecondaryUsers(" + userid + ")";
    } else {
        relevance = "1";
        filter = "getPrimaryUsers(" + userid + ")";
    }

    var queryString = "SELECT  u.userid, u.username, u.dateofbirth as date_of_birth, " +
                            "u.location_city, u.location_state, u.zipcode, u.personal_blurb, " +
                            "u.imageurls, " + /*u.medimageurls, */
                            "u.smallimageurls[1] as image_url, " +
                            "COALESCE (count.ct, 0) AS dancecard_count, " +
                            relevance + " AS relevance, u.logged_in " +
                        "FROM " + filter + " u LEFT OUTER JOIN " +
                              getDancecardCountQuery(userid) + " AS count ON (u.userid = count.userid), user_history h " +
                        "WHERE u.userid = h.userid AND h.urlid = " + getUrlIdQuery(url) + " AND " +
                            excludeUsers(usersToExclude) + " " +
                        "ORDER BY u.userid DESC LIMIT " + limit;

    dbClient.query(queryString, function (error, result) {
        if (error) {
            D.reject(error);
        } else {
            for (var i=0; i < result.rows.length; i++) {
              result.rows[i].age = calculateAge(result.rows[i].date_of_birth);
              result.rows[i].in_dancecard = false;
            }
            D.resolve(result.rows);
        }
    });

    return D.promise;
}

function getSharedInterest(dbClient, userid1, userid2) {
    var D = q.defer();

    var queryString = "SELECT urls.urlid, urls.url, urls.page_title, " +
                          "urls.primary_img_url, urls.embed_url, urls.embed_attr FROM " +
                          "(SELECT urlid from user_history WHERE userid = '" + userid1 + "') AS t0 " +
                      "JOIN (SELECT urlid FROM user_history WHERE userid = '" + userid2 + "') AS t1 " +
                          "ON t0.urlid = t1.urlid JOIN urls ON t0.urlid = urls.urlid";

    dbClient.query(queryString, function (error, result) {
        if (error) {
            D.reject(error);
        } else {
            D.resolve(result.rows);
        }
    });

    return D.promise;
}

function getUsersInterests(dbClient, userid) {
    var D = q.defer();

    var queryString = "SELECT u.username, c.level1, c.level2, SUM (c.score * h.visit_count) as interest_score " +
                      "FROM users u, url_categories c, user_history h WHERE u.userid =" + userid + " AND " +
                             "u.userid = h.userid AND h.urlid=c.urlid GROUP BY u.username, c.level1, c.level2 ORDER BY c.level1";

    dbClient.query(queryString, function (error, result) {
        if (error) {
            D.reject(error);
        } else {
            D.resolve(formatForTreemap(result.rows));
        }
    });

    return D.promise;
}

function calculateAge(dob){
    var today = moment();
    var birthdate = moment(dob);

    return today.diff(birthdate, 'years');
}

function getCityStateFromZipcode(zipcode) {
    var D = q.defer();

    var query = {
            zip: zipcode,
            country: 'US'
        };

    ziptastic(query)
      .then(function(location){
          D.resolve(location);
      }, function () {
          D.reject();
      });

    return D.promise;
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function serializeArrayForQuery(array) {
    var result = "'{";
    var lastIndex = array.length - 1;

    array.forEach(function (entry, index) {
        result += '"' + entry + '"';

        if (index !== lastIndex) {
            result += ",";
        } else {
            result += "}'";
        }
    });

    return result;
}

var users = {};

io.sockets.on('connection', function (socket) {

    socket.emit('init', {socketid: socket.id});

    socket.on('register-user', function (data) {
        // users[data.userid] = {socket: socket.id};
        console.log('registering...user...');
        if (users[data.userid]) {
            delete users[data.userid];
        }
        users[data.userid] = { socket: socket.id };
        console.log('registered user: ' + data.userid);
        console.log(users);
    });
    // io.sockets.socket(users.userid.socket).emit()
    socket.on('disconnect', function(){

    });

});

ee.on("message-added", function (data) {
    console.log("event has occured: ");
    console.log(data);
    if(users[data.receiverid]){
        io.sockets.socket(users[data.receiverid].socket).emit('new-message', data);
    }
});

ee.on("new_notification", function (data) {
    var fields = data.payload.split(',');

    console.log(fields);
    var userid = fields[0];
    var notification = {
        userid: userid,
        notificationid: fields[1],
        about_userid: fields[2],
        message: fields[3],
        extra_message: fields[4],
        action_time: fields[5],
        type: fields[6],
        subtype: fields[7],
        status: fields[8],
        imgurl: fields[9],
    };

    console.log('in socket io message...event new_notification');
    console.log('users[userid] = ' + users[userid] );
    console.log(users[userid]);
    console.log(users);
    if(users[userid]){
        console.log('all systems go...sending message off to sbe..');
        io.sockets.socket(users[userid].socket).emit('new-notification', notification);
    }
});




