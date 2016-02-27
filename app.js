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
var v1 = require('./routes/v1');
// create a new express server
var app = express();


app.use('/v1/',v1);

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
var funny_chat = require('./routes/esb/chat');
var chat_io = io.of('/chat').on('connection', function (socket) {
  funny_chat(socket, chat_io);
});


// start server on the specified port and binding host
http.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
