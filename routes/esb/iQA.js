const net = require('net');
const ROBOT_IP = "220.135.150.233";
const ROBOT_PORT = 3388;

var recv = "";

function getDateString(d){
  var year = d.getFullYear();
  var month = d.getMonth()+1;
  month = (month<10)?'0'+month:month;
  var day = d.getDate();
  day = (day<10)?'0'+day:day;
  var hour = d.getHours();
  hour = (hour<10)?'0'+hour:hour;
  var min = d.getMinutes();
  min = (min<10)?'0'+min:min;
  var sec = d.getSeconds();
  sec = (sec<10)?'0'+sec:sec;
  return year+"/"+month+"/"+day+" "+hour+":"+min+":"+sec;
}


function sendMessage(ip,port,server_no,user_no,msg){
  var client = new net.Socket();
  client.connect(port, ip, function() {
    console.log('Connected');
    var a = [];
    a.push(getDateString(new Date()));
    a.push(user_no);
    a.push(server_no);
    a.push("CQ");
    a.push(msg);
    client.write(a.join(","));
  });

  client.on('data', function(data) {
    console.log('Received: ' + data);
    recv = data;
    client.destroy(); // kill client after server's response
  });

  client.on('close', function() {
    console.log('Connection closed 2');
  });
}

function getMessageServer(msg){
  var client = new net.Socket();
  client.connect(ROBOT_PORT, ROBOT_IP, function() {
    console.log('Connected');
    var a = [];
    a.push(getDateString(new Date()));
    a.push("1");
    a.push("0");
    a.push("BR");
    a.push("Aix");
    a.push("Aix");
    client.write(a.join(","));
  });

  client.on('data', function(data) {
    var cols = data.split(",");
    var ip = cols[5];
    var port = cols[6];
    var server_no = cols[3];
    var user_no = cols[1];
    sendMessage(ip,port,server_no,user_no,msg);
    console.log('Received: ' + data);
    client.destroy(); // kill client after server's response
  });

  client.on('close', function() {
    console.log('Connection closed 1');
  });

}

module.export = {
  "getMessageServer": getMessageServer,
  "recv": recv
};
