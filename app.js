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

//Crawler weather
var parseString = require('xml2js').parseString;
var request = require('request');
var fs = require('fs');

function getTaipeiWeatherAndWriteToFile(href){
  request(href, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function(err,result){
        var weather = result.cwbopendata.dataset[0].parameterSet[0].parameter[0].parameterValue[0];
        fs.writeFile(__dirname+'/data/weather_taipei.txt',weather,function(err) {
          if (err!==null){
            console.log(err);
          }
        });
      });
    }
  });
}

function getWeatherinfoHref(dataid){
  return 'http://opendata.cwb.gov.tw/opendataapi?dataid='+dataid+'&authorizationkey='+process.env.WEATHER_AUTH_KEY;
}

function crawlerTaipeiWeather(){
  var taipei_id = 'F-C0032-009';
  getTaipeiWeatherAndWriteToFile(getWeatherinfoHref(taipei_id));
}

setInterval(crawlerTaipeiWeather,60000);

//Crawler bike
const zlib = require('zlib');

function getUbikeInfo() {
  var options = {'url': "http://data.taipei/youbike"};
  var req = request.get(options);
  req.on('response', function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });

    res.on('end', function() {
      var buffer = Buffer.concat(chunks);
      zlib.gunzip(buffer, function(error, decoded) {
        var body = decoded && decoded.toString();
        if(!error){
          var data = JSON.parse(body);
          for( var key in data.retVal){
            var datum = data.retVal[key];
            var name = datum.sna;
            var avaliable_bike = +datum.sbi;
            var avaliable_bike_space = +datum.bemp;
            if (name === '龍江南京路口'){
              fs.writeFile(__dirname+'/data/bike_taipei_branch.txt','在台北分行附近為龍江南京路口，目前還有'+avaliable_bike+"台車，還有"+avaliable_bike_space+"個空位",function(err){
                if(err !== null){
                  console.log(err);
                }
              });
            }
          }
        }
      });
    });
  });

  req.on('error', function(err) {
    callback(err);
  });

}

setInterval(getUbikeInfo,60000);





// start server on the specified port and binding host
http.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
