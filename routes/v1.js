var express = require('express');
var router = express.Router();
var fs = require('fs');

function getWeather(location,res){
  fs.readFile(__dirname+'/../data/weather_'+location+'.txt','utf8',function(err,data){
    if(err){
      res.header("Content-Type", "text/plain; charset=utf-8");
      res.end('error');
      console.log(err);
      return;
    }
    res.header("Content-Type", "text/plain; charset=utf-8");
    res.end(data);
    return;
  });
}

router.get('/weather/:city', function(req, res, next) {
    switch(req.params.city){
      case  "taipei":
        getWeather('taipei',res);
      break;
      default:
        res.end("GG");
    }
});


function getYoubike(res){
  fs.readFile(__dirname+'/../data/bike_taipei_branch.txt','utf8',function(err,data){
    if(err){
      res.header("Content-Type", "text/plain; charset=utf-8");
      res.end('error');
      console.log(err);
      return;
    }
    res.header("Content-Type", "text/plain; charset=utf-8");
    res.end(data);
    return;
  });
}

router.get('/youbike/:stop', function(req, res, next) {
    switch(req.params.stop){
      case  "ZhongshanDist":
        getYoubike(res);
      break;
      default:
        res.end("GG");
    }
});

module.exports = router;
