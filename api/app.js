var express = require('express');
var app = express();

var fs = require('fs');
var moment = require('moment');
var ziptastic = require('ziptastic');
var im = require('imagemagick')

//Database modules for working with postgresql
var pg = require('pg');
var pgclient = require('connect-pgclient');

//Modules for using node events
var events = require("events");
var EventEmitter = require("events").EventEmitter;
var ee = new EventEmitter();

//For Socket.io 
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// app.listen(3000);
server.listen(3000);
console.log("listening at port 3000");


var pgConnectionString = "postgres://sidebar:5432@localhost/sidebar";

var client = new pg.Client(pgConnectionString);
client.connect();
client.query('LISTEN "watchers"');
client.on('notification', function(data) {
	console.log('###################### notification received ######################');
	ee.emit('new_notification', data);
});

function listenForNotifications(req,res,next){
	  // req.db.client.on('notification', function(msg) {
	  // 	  ee.emit('new_notification', msg);
	  // });
	  // var query = req.db.client.query("LISTEN watchers");
	  next();
};

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var connectToDb = pgclient({
    config : {
        database : 'sidebar',
        user     : 'sidebar',//'derekkan',//Christina',
        host     : 'localhost',
        port     : 5432
    }
});

passport.use(new LocalStrategy({
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
      if (result.rows.length == 0) {
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
 
  req.db.client.query(queryString, function(err, result){
  	// console.log('deserialize user..');
  	// console.log(result);
  	done(err, result.rows[0]);
  });
});

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
  app.use(express.session({ secret: 'so secret' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

app.get('/', function(req, res){
  res.send('hello world');
});

app.post('/signup', 
	createNewUser,
	createNewUserPref,
	function(req, res){
	console.log('posted signup form data');
	//console.log(req.body);
	console.log(req.signupResult);
	console.log(req.prefResult);
	var age = calculateAge(req.signupResult.rows[0].dateofbirth);
	req.signupResult.rows[0].age = age;
	res.json({user: req.signupResult.rows[0], pref: req.prefResult.rows[0]});
});


function createNewUser(req, res, next){
	var user = req.body.user;
	user.dateofbirth = moment([user.dob_year, user.dob_month, user.dob_day]).format('YYYY-MM-DD');//'1982-11-27'

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
									  "smallimageurls) " +
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
							   				 smallurls + ") " + 
								"RETURNING *";
		console.log(queryString);

		req.db.client.query(queryString, function(err, result){
			req.signupResult = result;
			 console.log("result of inserting user...");
			console.log(result.rows[0].userid);
			req.userid = result.rows[0].userid;
			// console.log("Errors?...");
			// console.log(err);
			// console.log
			next();
		});
	});
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function replaceAll(find,replace,str){ 
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function createNewUserPref(req, res, next){
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
		req.prefResult = result;
		// console.log("result of inserting user preferences...");
		// console.log(result);
		// console.log("Errors?...");
		// console.log(err);
		// console.log
		next();
	});
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
							  quality: 1,
							  gravity: "Center"//default gravity is Center
							}, function(err, stdout, stderr){
							  if (err){
							  	console.log(err);
							  }
							  else{
							  	console.log('cropped image to fit within 200x200px');
							  	// console.log('resizeed image to fit within 200x200px');

								im.crop({
								  srcPath: newPath,
								  dstPath: smallPath,
								  width:   36,
								  height: 36,
								  quality: 1,
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
		res.json({origImageUrl: 'http://localhost:3000/scaled_' + req.files.file.name, 
				  medImageUrl: "http://localhost:3000/med_" + req.files.file.name,
				  smallImageUrl: "http://localhost:3000/small_" + req.files.file.name

		});
	});


app.post('/login', 
	//connectToDb, 
	passport.authenticate('local'),
	function(req, res){
		console.log(req.body);
		console.log("user authenticated!...");
		console.log(req.user);
		res.json({userid: req.user.userid});
	});

app.get('/logout', function(req, res){
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
  if (req.isAuthenticated()) { return next(); }
  res.json({status: "logged_out"});
}

app.get('/message/:partnerId',
	ensureAuthenticated,
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

		//console.log(req.body);
		var queryString = "INSERT INTO messages " + 
								"(senderId, receiverId, message, sendTime) " +
						   "VALUES (" + senderId + "," + receiverId + ",'" + replaceAll("'", "''", message) + "','" + sendTime + "') " +
						   "RETURNING *";
		//console.log(queryString);
		
		req.db.client.query(queryString, function(err, result){
			// console.log('result: ');
			// console.log(result);
			// console.log('err: ');
			// console.log(err);
			ee.emit('someEvent', result.rows[0]);
			next();
		});
	},
	function(req, res){
		res.send(200);
	});

app.get('/notifications/:userid',
	function(req, res, next){
		var userid = req.params.userid;

		var queryString = "SELECT notificationid, message, action_time, type, status " +
							"FROM notifications " + 
							"WHERE userid=" + userid + 
							"ORDER BY action_time DESC";

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
									"' WHERE notificationid = " + req.body.notification.notificationid;
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
			var age = calculateAge(req.queryResult.rows[i].dateofbirth);
			req.queryResult.rows[i].age = age;
			// req.queryResult.rows[i].mutual = checkMutual(req, req.queryResult.rows[i].userid, req.userid);
		}
		next();
	},
	function(req, res){
		console.log('dancecard data...');
		console.log(req.queryResult.rows);
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
		console.log('Your on these folds dancecard... data...');
		console.log(req.queryResult.rows);
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
									"users.dateofbirth,"+ 
									"users.username,"+
									"users.location_city,"+ 
									"users.location_state,"+ 
									"users.personal_blurb,"+
									"users.imageurls,"+
									"users.medimageurls,"+
									"users.smallimageurls,"+ 
									"danceCard.mutual "+  
							"FROM users,"+ 
								 "danceCard "+ 
							"WHERE danceCard.userId =" + req.userid + " AND "+
								  "danceCard.status != 'removed' AND "+ 
								  "users.userId=danceCard.partnerId " +
						    "ORDER BY updatetime ASC";

		//gets userid and status of memebers in dancecard
		// var queryString = "SELECT partnerid,"
		// 							"status "+  
		// 					"FROM dancecard "+ 
		// 					"WHERE userid =" + userId + " AND "+
		// 						  "status != 'removed'";

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
// 	SELECT (partnerid, status) FROM dancecard WHERE partnerid=req.dancecard.userid;
// }
    
function addToDanceCard(req,res,next) {
	var addTime = moment().format('YYYY-MM-DD HH:mm:ss');
	var queryString = "INSERT INTO danceCard "+
						  "(userId, partnerId, status, updatetime) " + 
					   "VALUES (" + req.dancecard.userid + "," + 
					   				req.dancecard.partnerid  + ",'" + 
					   				req.dancecard.status + "','" + 
					   				addTime + "')";

		//console.log(queryString);
		req.db.client.query(queryString, function(err, result){
			//deal with error 
			req.update = err ? true : false;
			next();
		});
};

function updateDanceCardStatus(req,res,next) {
		if(req.update){
			var updateTime = moment().format('YYYY-MM-DD HH:mm:ss');
			var queryString = "UPDATE danceCard "+
								  "SET status = '"+ req.dancecard.status +"'," +
								  		"updatetime = '" + updateTime + 
								  "' WHERE userid = " + req.dancecard.userid + 
								  " AND partnerid = " + req.dancecard.partnerid;
				// console.log(queryString);
				req.db.client.query(queryString, function(err, result){
					//deal with error 
					next();
				});
		}
		else{
			next();
		}
};

// function checkMutualDancecard(req, res, next) {
// 	var queryString = "SELECT check_mutual(" + req.dancecard.userid + "," + req.dancecard.partnerid + ")";
// 	// console.log("I'm checking for mutuality...");
// 	// console.log(queryString);
// 	req.db.client.query(queryString, function(err, result){
// 		// console.log(result.rows);
// 		next();
// 	});
// }

function verifyDanceCardParameters(req,res,next) {
		console.log(req.dancecard);
		if(req.dancecard.status && req.dancecard.userid && req.dancecard.partnerid){
			req.dancecard.status = "'" + req.dancecard.status + "'";
			req.dancecard.userid = parseInt(req.dancecard.userid);
			req.dancecard.partnerid = parseInt(req.dancecard.partnerid);
			// console.log('all checked out, error is elsewhere');
			next();
		}
		else{
			// console.log('what happened?');
			res.send(500);
		}
};

app.get('/profile/:userid', 
	//connectToDb, 
	function(req, res, next){

		var userid = req.params.userid;

		var queryString = "SELECT userid, username, dateofbirth," +
							"location_city, location_state, personal_blurb, "+
							"imageurls, medimageurls, smallimageurls "+ 
							"FROM users "+
							"WHERE userid=" + userid;
		req.db.client.query(queryString, function(err, result){
			
			req.queryResult = result;
			next();
		}) 
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

		console.log(req.query);
		req.url = req.query.url;
		req.userid = req.query.userid;
		req.limit = req.query.limit;
		if(req.query.pageprofiles){
			req.pageprofiles = req.query.pageprofiles.split(',');
		}
		next();
		// console.log('get request /crowd/' + url);
	}, 
	getDancecardRecord,
	getPeopleOnPage,
	function (req, res) {
		//console.log(req.queryResult);
		for(var i=0; i<req.queryResult.rows.length; i++){
			var age = calculateAge(req.queryResult.rows[i].dateofbirth);
			req.queryResult.rows[i].age = age;
		}
		res.json(req.queryResult.rows);

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
				  	req.queryResult = result;
				  	// console.log(req.queryResult);
				  	next();
				  });
	}

function getPeopleOnPage(req,res,next) {

	var whereClause = "WHERE userid != " + req.userid;

	// console.log(req.userid);
	// console.log('result of querying dancecard record...');
	// console.log(req.queryResult);
	for(var i=0; i<req.queryResult.rows.length; i++){
		whereClause += " AND userid !=" + req.queryResult.rows[i].userid;
	}

	if(req.pageprofiles){
		for(var i=0; i<req.pageprofiles.length; i++){
			whereClause += " AND userid !=" + req.pageprofiles[i];
		}
	};

	var queryString = "SELECT  userid, username, dateofbirth, " +
						"location_city, location_state, zipcode, personal_blurb, "+
						"imageurls, medimageurls, smallimageurls "+
						  "FROM users " + whereClause + 
						  " LIMIT " + req.limit;

		// console.log(queryString);
		req.db.client.query(queryString, function(err, result){
			//deal with error 
			req.queryResult = result;
			next();
		});
	};
	
function calculateAge(dob){
	var today = moment();
	var birthdate = moment(dob);

	return today.diff(birthdate, 'years');
}

exports.util = calculateAge;

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

app.post('/processHistory', function(req, res){
  console.log(req.body);      // your JSON
  res.send(req.body);    // echo the result back
});


var users = {};

io.sockets.on('connection', function(socket){

	socket.emit('init', {socketid: socket.id});//

	socket.on('register-user', function(data){
		// users[data.userid] = {socket: socket.id};
		if(users[data.userid]){
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

	ee.on("someEvent", function (data) {
    	console.log("event has occured: ");
    	console.log(data);
    	if(users[data.receiverid]){
			io.sockets.socket(users[data.receiverid].socket).emit('new-message', data);
		}
	});

	ee.on("new_notification", function (data) {
		// console.log('all listeners for new_notification...');
		// console.log(ee.listeners("new_notification"))
  //   	console.log("new_notification event has occured: ");
  //   	console.log(data);
    	var fields = data.payload.split(',');
    	// console.log(fields)
    	var userid = fields[0];
    	var notification = {
    		notificationid: fields[1],
    		about_userid: fields[2],
    		message: fields[3],
    		action_time: fields[4],
    		type: fields[5],
    		subtype: fields[6],
    		status: fields[7]
    	};

    	if(users[userid]){
    		io.sockets.socket(users[userid].socket).emit('new-notification', notification);
    	}
	});


