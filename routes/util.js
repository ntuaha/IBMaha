
//Crawler weather
var parseString = require('xml2js').parseString;
var request = require('request');
var fs = require('fs');

const DURATION = 60000;

function getTaipeiWeatherAndWriteToFile(href){
  request(href, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function(err,result){
        var weather = result.cwbopendata.dataset[0].parameterSet[0].parameter[0].parameterValue[0];
        fs.writeFile(__dirname+'/../data/weather_taipei.txt',weather,function(err) {
          if (err!==null){
            console.log(err);
          }
        });
      });
    }
  });
}


function crawlerTaipeiWeather(){
  var taipei_id = 'F-C0032-009';
  var taipei_href = 'http://opendata.cwb.gov.tw/opendataapi?dataid='+taipei_id+'&authorizationkey='+process.env.WEATHER_AUTH_KEY;
  getTaipeiWeatherAndWriteToFile(taipei_href);
}

setInterval(crawlerTaipeiWeather,DURATION);

//Crawler bike
const zlib = require('zlib');

function extractSpeiciifcStop(body){
  var data = JSON.parse(body);
  for( var key in data.retVal){
    var datum = data.retVal[key];
    var name = datum.sna;
    var available_bike = +datum.sbi;
    var available_bike_space = +datum.bemp;
    if (name === '龍江南京路口'){
      (function(result){
        fs.writeFile(__dirname+'/../data/bike_taipei_branch.txt','在台北分行附近為龍江南京路口站，目前有'+result.available_bike+"台車，有"+result.available_bike_space+"停腳踏車位",function(err){
          if(err !== null){
            console.log(err);
          }
        });
      })({'available_bike': available_bike, 'available_bike_space': available_bike_space});
    }
  }
}


function getUbikeInfo() {
  return new Promise(function(resolve,reject){
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
          if(error !== null){
            reject(error);
            return;
          }
          resolve(decoded && decoded.toString());
        });
      });

    });

    req.on('error', function(err) {
      reject(err);
    });
  });
}

function timerGetUbikeInfo(){
  getUbikeInfo().then(function(data){
    extractSpeiciifcStop(data);
  });
}

setInterval(timerGetUbikeInfo,DURATION);
