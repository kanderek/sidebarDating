var express = require('express');
var moment = require('moment');
var app = express();
var pg = require('pg');
var pgclient = require('connect-pgclient');
// var conString = "postgres://derekkan:5432@localhost/sidebar";

// var client = new pg.Client(conString);

var connectToDb = pgclient({
    config : {
        database : 'sidebar',
        user     : 'derekkan',
        host     : 'localhost',
        port     : 5432
    }
});


app.configure(function(){
  // app.use(express.static(__dirname + '/public'));
  // app.use(express.static(__dirname + '/files'));
  app.use(express.logger());
  app.use(express.static(__dirname + '/static/images'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(app.router);
});

app.get('/', function(req, res){
  res.send('hello world');
});


app.get('/message',
	connectToDb,
	function(req, res, next){
		var userId = req.query.userId;
		var partnerId = req.query.partnerId;

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
	connectToDb,
	function(req, res, next){
		var senderId = req.body.senderId;
		var receiverId = req.body.receiverId;
		var message = req.body.message;
		var sendTime = moment().format('YYYY-MM-DD HH:mm:ss');

		var queryString = "INSERT INTO messages " + 
								"(senderId, receiverId, message, sendTime) " +
						   "VALUES (" + senderId + "," + receiverId + ",'" + message + "','" + sendTime + "')";
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
	connectToDb,
	function(req, res, next){
		var userId = req.params.userId;
		
		var queryString = "SELECT users.userId," +
									"users.age,"+ 
									"users.location_city,"+ 
									"users.location_state,"+ 
									"users.personal_blurb,"+ 
									"danceCard.status "+  
							"FROM users,"+ 
								 "danceCard "+ 
							"WHERE danceCard.userId =" + userId + " AND "+
								  "danceCard.status != 'removed' AND "+ 
								  "users.userId=danceCard.partnerId";
		//console.log(queryString);

		req.db.client.query(queryString, function(err, result){
				  	req.queryResult = result;
				  	next();
				  });
	},
	function(req, res){
		res.json(req.queryResult.rows);
	});

app.get('/dancecard',
	connectToDb,
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
	verifyDanceCardParameters(),
	addToDanceCard(),
	updateDanceCardStatus(),
	function(req, res){
		res.send(200);
	});


app.post('/dancecard', 
	connectToDb, 
	function(req, res, next){
		req.dancecard = req.body;

		next();
		//if entry.status == remove -> send notification to removed user;
		//if entry.status == add
			//if responding to add -> 
			//else -> send notification to added user;
		//if entry.status == mutual -> ??

	},
	verifyDanceCardParameters(),
	addToDanceCard(),
	updateDanceCardStatus(),
	function(req, res){
		res.send(200);
	});

    
function addToDanceCard() {

	return  function(req,res,next) {
	var queryString = "INSERT INTO danceCard "+
						  "(userId, partnerId, status)" + 
					   "VALUES (" + req.dancecard.userid + "," + 
					   				req.dancecard.partnerid  + "," + 
					   				req.dancecard.status + ")";

		//console.log(queryString);
		req.db.client.query(queryString, function(err, result){
			//deal with error 
			req.update = err ? true : false;
			next();
		});
	}
};

function updateDanceCardStatus() {

	return  function(req,res,next) {
		if(req.update){
			var queryString = "UPDATE danceCard "+
								  "SET status = "+ req.dancecard.status +
								  " WHERE userid = " + req.dancecard.userid + 
								  " AND partnerid = " + req.dancecard.partnerid;
				//console.log(queryString);
				req.db.client.query(queryString, function(err, result){
					//deal with error 
					next();
				});
		}
		else{
			next();
		}
	}
};

function verifyDanceCardParameters() {

	return function(req,res,next) {
		//console.log(req.dancecard);
		if(req.dancecard.status && req.dancecard.userid && req.dancecard.partnerid){
			req.dancecard.status = "'" + req.dancecard.status + "'";
			req.dancecard.userid = parseInt(req.dancecard.userid);
			req.dancecard.partnerid = parseInt(req.dancecard.partnerid);

			next();
		}
		else{
			res.send(500);
		}
	}
};

app.get('/crowd/', 
	connectToDb, 
	function(req, res, next){

		var url = req.query;
		next();
		// console.log('get request /crowd/' + url);
	}, 
	getPeopleOnPage(),
	function (req, res) {
		//console.log(req.queryResult);
		res.json(req.queryResult.rows);

	});

function getPeopleOnPage() {

	return  function(req,res,next) {
	var queryString = "SELECT  userid, username, age, location_city, location_state, personal_blurb "+
						  "FROM users ";
		console.log(queryString);
		req.db.client.query(queryString, function(err, result){
			//deal with error 
			req.queryResult = result;
			next();
		});
	}
};
	

app.post('/processHistory', function(req, res){
  console.log(req.body);      // your JSON
  res.send(req.body);    // echo the result back
});


app.listen(3000);
console.log("listening at port 3000");
