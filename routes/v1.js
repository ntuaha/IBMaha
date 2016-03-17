var express = require('express');
var router = express.Router();
var bike = require("./v1/bike");
var time = require("./v1/time");
var weather = require("./v1/weather");

router.get('/weather/:city',weather);
router.get('/youbike/:stop',bike);
router.get('/time',time);

module.exports = router;
