const net = require('net');
const iconv = require('iconv-lite');
const ROBOT_IP = "220.135.150.233";
const ROBOT_PORT = 3388;


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

function fromBufToUTF8(buf){
  return iconv.decode(buf, "big5");
}
function encodeBig(string){
  return iconv.decode(iconv.encode(string,"utf8"),"utf8");
}


function sendMessage(ip,port,server_no,user_no,msg,callback){
  var client = new net.Socket();
  client.connect(port, ip, function() {
    //console.log('Connected');
    var a = [];
    a.push(getDateString(new Date()).split(" ")[1]);
    a.push(user_no);
    a.push(server_no);
    a.push("CQ");
    a.push(msg);
    var send = iconv.encode(a.join(","),'big5');
    //console.log("send: "+ send);
    client.write(send);
  });

  client.on('data', function(buf) {
    var recv = fromBufToUTF8(buf).split(",")[3];
    //console.log("recv: "+recv);
    callback(recv);
    client.destroy(); // kill client after server's response

  });

  client.on('close', function() {
    //console.log('Connection closed 2');
  });
}

function getMessageServer(msg,callback){
  var client = new net.Socket();
  client.connect(ROBOT_PORT, ROBOT_IP, function() {
    //console.log('Connected');
    var a = [];
    a.push(getDateString(new Date()));
    a.push("1");
    a.push("0");
    a.push("BR");
    a.push("Aix");
    a.push("Aix");
    client.write(a.join(","));
  });

  client.on('data', function(buf) {
    //console.log(fromBufToUTF8(buf));
    var cols = fromBufToUTF8(buf).split(",");
    var ip = cols[5];
    var port = cols[6];
    var server_no = cols[3];
    var user_no = "1";
    sendMessage(ip,port,server_no,user_no,msg,callback);
    client.destroy(); // kill client after server's response
  });

  client.on('close', function() {
    ///console.log('Connection closed 1');
  });

}

function handleMessage(req,res,next){
  getMessageServer(req.query.q,function(data){
    res.json(data);
  });
}


module.exports = {
  "getMessageServer": getMessageServer,
  "http": handleMessage
};
