var express = require('express');
var moment = require('moment');
var app = express();
var pg = require('pg');
var pgclient = require('connect-pgclient');
// var conString = "postgres://derekkan:5432@localhost/sidebar";

// var client = new pg.Client(conString);
//var flash = require("flash");

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var connectToDb = pgclient({
    config : {
        database : 'sidebar',
        user     : 'derekkan',
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
  	var queryString = "SELECT userid, username, email, password FROM users WHERE email='" + email + "'";
  	
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
  done(null, user.userid);
});

passport.deserializeUser(function(req, userid, done) {
  var queryString = "SELECT (userid, username, email, password) FROM users WHERE userid=" + userid;
 
  req.db.client.query(queryString, function(err, result){
  	done(err, result.rows[0]);
  });
});



app.configure(function(){
  // app.use(express.static(__dirname + '/public'));
  // app.use(express.static(__dirname + '/files'));
  app.use(express.logger());
  app.use(express.static(__dirname + '/static/images'));
  app.use(express.cookieParser());
  app.use(express.json());
  app.use(express.urlencoded());
  // app.use(flash());
  app.use(connectToDb);
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
	console.log(req.body);
	res.send(200);
});


function createNewUser(req, res, next){
	var user = req.body.user;
	user.dateofbirth = moment([user.dob_year, user.dob_month, user.dob_day]).format('YYYY-MM-DD');//'1982-11-27'

	var queryString = "INSERT INTO users " + 
								"(username," + 
								  "email," + 
								  "password," + 
								  "gender," + 
								  "dateofbirth," +
								  "zipcode," + 
								  "personal_blurb) " +
						   "VALUES ('" + user.username  + "','" + 
						   				 user.email + "','" + 
						   				 user.password + "','" + 
						   				 user.gender + "','" + 
						   				 user.dateofbirth + "','" +
						   				 user.zipcode + "','" + 
						   				 replaceAll("'", "''", user.personal_blurb) + "') " + 
							"RETURNING *";
	//console.log(queryString);

	req.db.client.query(queryString, function(err, result){
		req.queryResult = result;
		 console.log("result of inserting user...");
		console.log(result.rows[0].userid);
		req.userid = result.rows[0].userid;
		// console.log("Errors?...");
		// console.log(err);
		// console.log
		next();
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
						   				 pref.distance_max + ")";
	// console.log(queryString);

	req.db.client.query(queryString, function(err, result){
		req.queryResult = result;
		// console.log("result of inserting user preferences...");
		// console.log(result);
		// console.log("Errors?...");
		// console.log(err);
		// console.log
		next();
	});
}



app.post('/login', 
	//connectToDb, 
	passport.authenticate('local'),
	function(req, res){
		// console.log(req.body);
		// console.log("user authenticated!...");
		// console.log(req.user);
		res.json({userid: req.user.userid});
	});

app.get('/logout', function(req, res){
  req.logout();
  res.send(200);
});

//use this middleware for routes that require a user to be logged in/authenticated

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
}

app.get('/message/:partnerId',
	//connectToDb,
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
		console.log(req.user);
		var senderId = req.body.senderid;
		var receiverId = req.body.receiverid;
		var message = req.body.message;
		var sendTime = moment().format('YYYY-MM-DD HH:mm:ss');

		//console.log(req.body);
		var queryString = "INSERT INTO messages " + 
								"(senderId, receiverId, message, sendTime) " +
						   "VALUES (" + senderId + "," + receiverId + ",'" + replaceAll("'", "''", message) + "','" + sendTime + "')";
		//console.log(queryString);
		
		req.db.client.query(queryString, function(err, result){
			// console.log('result: ');
			// console.log(result);
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
	function(req, res){
		res.json(req.queryResult.rows);
	});

app.get('/dancecard',
	//connectToDb,
	function(req, res, next){
		req.dancecard = req.query;
		//console.log(req.dancecard);
		next();

		//if entry.status == remove -> send notification to removed user;
		//if entry.status == add
			//if responding to add -> 
			//else -> send notification to added user;
		//if entry.status == mutual -> ??

	},
	verifyDanceCardParameters,
	addToDanceCard,
	updateDanceCardStatus,
	function(req, res){
		res.send(200);
	});

function getDancecardById(req, res, next){
		
		//gets full profile of all memebers in dancecard
		var queryString = "SELECT users.userId," +
									"users.age,"+ 
									"users.username,"+
									"users.location_city,"+ 
									"users.location_state,"+ 
									"users.personal_blurb,"+ 
									"danceCard.status "+  
							"FROM users,"+ 
								 "danceCard "+ 
							"WHERE danceCard.userId =" + req.userid + " AND "+
								  "danceCard.status != 'removed' AND "+ 
								  "users.userId=danceCard.partnerId";

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
	function(req, res){
		res.redirect('/dancecard/'+req.dancecard.userid);
	});


// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) { return next(); }
//   res.send(401);
// }
    
function addToDanceCard(req,res,next) {
	var queryString = "INSERT INTO danceCard "+
						  "(userId, partnerId, status) " + 
					   "VALUES (" + req.dancecard.userid + "," + 
					   				req.dancecard.partnerid  + ",'" + 
					   				req.dancecard.status + "')";

		//console.log(queryString);
		req.db.client.query(queryString, function(err, result){
			//deal with error 
			req.update = err ? true : false;
			next();
		});
};

function updateDanceCardStatus(req,res,next) {
		if(req.update){
			var queryString = "UPDATE danceCard "+
								  "SET status = '"+ req.dancecard.status +
								  "' WHERE userid = " + req.dancecard.userid + 
								  " AND partnerid = " + req.dancecard.partnerid;
				console.log(queryString);
				req.db.client.query(queryString, function(err, result){
					//deal with error 
					next();
				});
		}
		else{
			next();
		}
};

function verifyDanceCardParameters(req,res,next) {
		console.log(req.dancecard);
		if(req.dancecard.status && req.dancecard.userid && req.dancecard.partnerid){
			req.dancecard.status = "'" + req.dancecard.status + "'";
			req.dancecard.userid = parseInt(req.dancecard.userid);
			req.dancecard.partnerid = parseInt(req.dancecard.partnerid);
			console.log('all checked out, error is elsewhere');
			next();
		}
		else{
			console.log('what happened?');
			res.send(500);
		}
};

app.get('/profile/:userid', 
	//connectToDb, 
	function(req, res, next){

		var userid = req.params.userid;

		var queryString = "SELECT userid, username, age, location_city, location_state, personal_blurb "+ 
							"FROM users "+
							"WHERE userid=" + userid;
		req.db.client.query(queryString, function(err, result){
			req.queryResult = result;
			next();
		}) 
	},
	function (req, res) {
		//console.log(req.queryResult);
		res.json(req.queryResult.rows);

	});

app.get('/crowd/', 
	//connectToDb, 
	function(req, res, next){

		req.url = req.query.url;
		req.userid = req.query.userid;
		next();
		// console.log('get request /crowd/' + url);
	}, 
	getDancecardById,
	getPeopleOnPage,
	function (req, res) {
		//console.log(req.queryResult);
		res.json(req.queryResult.rows);

	});

function getPeopleOnPage(req,res,next) {

	var whereClause = "WHERE userid != " + req.userid;

	// console.log(req.userid);
	// console.log(req.queryResult);
	for(var i=0; i<req.queryResult.rows.length; i++){
		whereClause += " AND userid !=" + req.queryResult.rows[i].userid;
	}

	var queryString = "SELECT  userid, username, age, location_city, location_state, personal_blurb "+
						  "FROM users " + whereClause;

		//console.log(queryString);
		req.db.client.query(queryString, function(err, result){
			//deal with error 
			req.queryResult = result;
			next();
		});
	};
	

app.post('/processHistory', function(req, res){
  console.log(req.body);      // your JSON
  res.send(req.body);    // echo the result back
});


app.listen(3000);
console.log("listening at port 3000");
