var request = require('request');
var fs = require('fs');
request = request.defaults({ jar: true });


var users = {};

function extractIP(socket){
  var ip="0";
  if (socket.request.connection.remoteAddress.indexOf(":")>-1){
    ip = socket.request.connection.remoteAddress.split(":");
    ip = ip[ip.length-1];
  }
  return ip;
}


//加入使用者
function handleAddUser(socket,io){
  socket.on('addUser',function(msg){
    console.log(socket.request.connection.remoteAddress);
    var ip = extractIP(socket);
    users[socket.id] = {"name":msg.name,"nickname":"","ip":ip};
    users[socket.id].uid = socket.id;
    users[socket.id].login_dt= new Date();
    handleNickname(socket, io, msg.nickname);
    socket.emit("addUser_success",{"name":msg.name,"nickname":msg.nickname});
    console.log({"name":msg.name,"nickname":msg.nickname});
  });
}

//確認與更新使用者暱稱
function handleNickname(socket,io,nickname){
    if (users[socket.id].nickname !=nickname){
      users[socket.id].nickname = nickname;
      refreshUserList(io);
    }
}

//更新使用者清單
function refreshUserList(io){
  io.emit('users', {"userlist":users});
}
function handleDisconnetion(socket,io){
  socket.on('disconnect', function(msg){
      if(users[socket.id]!==undefined){
        delete users[socket.id];
        refreshUserList(io);
      }else{
        socket.emit("lost_user",{});
      }
  });
}

//訊息處理
//確認與更新使用者暱稱
function handleMessage(socket,io){

  socket.on('idle', function(msg){
    if(users[socket.id] !== undefined){
      msg.t = new Date();
      msg.name = users[socket.id].name;
      handleNickname(socket,io,msg.nickname);
      io.emit('idle_success', {"userlist":users});
    }
  });

  socket.on('chat_msg', function(msg){
    if(users[socket.id] !== undefined){
      msg.t = new Date();
      msg.name = users[socket.id].name;
      handleNickname(socket,io, msg.nickname);
      var arr =  [socket.id,users[socket.id].ip,msg.name,msg.nickname,Date.now(),msg.message.replace(/,/g,"\\,")];
      fs.appendFile(__dirname +'/message.txt',arr.join(",")+"\n", function (err) {
        if(err!==null){
          console.log(err);
        }
      });
      socket.emit('chat_msg_success_user', {});
      io.emit('chat_msg_success', msg);
      if(msg.message[0] == "喵"){
        request("http://funny.aha.taipei/esb/ai/1/message/"+encodeURIComponent(msg.message.slice(1)), function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            if(data.answerMsg !== undefined){
              var msg = data.answerMsg[0];
              io.emit('chat_msg_success',{"name":"喵管家","nickname":"喵喵","message":msg,t:new Date()});
            }
          }
        });
      }
    }else{
      socket.emit("lost_user",{});
    }
  });

}


function connection(socket,io) {
    console.log(socket.id+' connected');
    handleAddUser(socket,io);
    handleMessage(socket,io);
    handleDisconnetion(socket,io);
}

module.exports = connection;
