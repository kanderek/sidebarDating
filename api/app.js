var express = require('express');
var app = express();
var pg = require('pg');
var conString = "postgres://derekkan:5432@localhost/sidebar";

var client = new pg.Client(conString);

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


app.get('/messages/:userId', function(request, response){

});

app.get('/dancecard/:userId', function(request, response){
	var userId = request.params.userId;
	response.send('hello ' + userId + " we're getting your dancecard!");
});

app.post('/dancecard', function(request, response){
	var userId = request.params.userId;

});

app.get('/crowd/:url', function(request, response){

	var url = request.params.url;
	console.log('get request /crowd/' + url);

	pg.connect(conString, function(err, client, done) {
	  if(err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('SELECT * FROM users', function(err, result) {
	    //call `done()` to release the client back to the pool
	    done();

	    if(err) {
	      return console.error('error running query', err);
	    }
	    console.log(result.rows);
	    response.json(result.rows);
	    //output: 1
	  });
	});
	// client.connect(function(err) {
	//   if(err) {
	//   	//response.send(500);
	//     return console.error('could not connect to postgres', err);
	//   }

	//   client.query('SELECT * FROM users', function(err, result) {
	//     if(err) {
	//       //response.send(500);
	//       return console.error('error running query', err);
	//     }
	//     client.end();
	// 	response.json(result.rows);
	//   });
	// });
});

app.post('/processHistory', function(req, res){
  console.log(req.body);      // your JSON
  res.send(req.body);    // echo the result back
});


app.listen(3000);
console.log("listening at port 3000");
