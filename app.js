/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

var v1 = require('./routes/v1');
app.use('/v1/',v1);

var ai = require('./routes/esb/ai');
app.use('/ai/RFAQ',express.static(__dirname + '/data/機器人語庫.txt'));
app.use('/ai/RHala',express.static(__dirname + '/data/RobotHala.txt'));
app.use('/ai/MFAQ',express.static(__dirname + '/data/ALL長語庫.txt'));
app.use('/ai/',ai);



app.use('/chat',function(req,res,next){
  res.redirect("http://aha-chat.mybluemix.net/chat/");
});

// serve the files out of ./public as our main files
app.use('/',express.static(__dirname + '/public'));


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.use(function (req, res, next) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  var err = new Error('Not Found');
  res.status(err.status || 404);
  res.end('Not Found QQ');
});


// setting socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);


require('./routes/util.js');


// start server on the specified port and binding host
http.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
