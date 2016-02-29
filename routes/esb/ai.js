var request = require('request');
var fs = require('fs');
const express = require('express');
var router = express.Router();
var multer  =   require('multer');

const DATA_BASEPATH = __dirname+'/../../data/';

function makerUploader(name,uploadName){
  var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, DATA_BASEPATH);
    },
    filename: function (req, file, callback) {
      callback(null, name);
    }
  });
  return multer({ "storage" : storage}).single(uploadName);
}

var upload_NAOHala = makerUploader('RobotHala.txt',"NAOHala");
var upload_NAO = makerUploader('機器人語庫.txt',"NAO");
var upload_IQA = makerUploader('ALL長語庫.txt',"IQA");


router.post('/editor/NAOHala', upload_NAOHala, function (req, res, next) {
  res.end("NAOHala");
});

router.post('/editor/NAO', upload_NAO, function (req, res, next) {
  res.end("NAO");
});

router.post('/editor/IQA', upload_IQA, function (req, res, next) {
  res.end("IQA");
});


module.exports = router;
