var express = require('express');
var router = express.Router();
var parseString = require('xml2js').parseString;
var request = require('request');


function getWeather(href,res){
  request(href, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function(err,result){
        var weather = result.cwbopendata.dataset[0].parameterSet[0].parameter[0].parameterValue[0];
        res.header("Content-Type", "text/plain; charset=utf-8");
        res.end(weather);
      });
    }
  });
}

function getWeatherinfoHref(dataid){
  return 'http://opendata.cwb.gov.tw/opendataapi?dataid='+dataid+'&authorizationkey='+process.env.WEATHER_AUTH_KEY;
}


router.get('/weather/:city', function(req, res, next) {
    switch(req.params.city){
      case  "taipei":
        getWeather(getWeatherinfoHref('F-C0032-009'),res);
      break;
      default:
        res.end("GG");
    }
});

module.exports = router;
