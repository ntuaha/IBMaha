function getTimeText(d){
  var s = "";
  s = d.getFullYear() + "/" + (d.getMonth()+1)+"/"+d.getDate() + " " +d.getHours() +":"+d.getMinutes()+":"+d.getSeconds();
  return s;
}

function parseTime(d){
  console.log(d);
  var t = d.split("T")[1].split("Z")[0].split(":");
  return (+t[0]+8)%24+":"+t[1];
}

function setTime(year,month,date,hour,minute,second){
  var d = new Date();
  d.setFullYear(year);
  d.setMonth(month-1);
  d.setDate(date);
  d.setHours(hour);
  d.setMinutes(minute);
  d.setSeconds(second);
  return d;
}
function diffTime(now,destine){
  var diffTime = Math.floor((destine.getTime() - now.getTime())/1000);
  var day = Math.floor(diffTime / 86400);
  var hour = Math.floor((diffTime - 86400*day) / 3600);
  var minute  = Math.floor((diffTime - 86400*day - 3600*hour) / 60);
  var sec = diffTime - 86400*day - 3600*hour - 60*minute;
  return "離台東行剩下 " +day+ " 天 " +hour+ " 小時 "+minute + " 分 "+sec +" 秒 ";
}
var des = new Date();
function showTime(){
  var now = new Date();
  $(".ALERT").html(getTimeText(now) +" "+diffTime(now,des) );
  setTimeout(showTime,[1000]);
}
$(function(){
  des = setTime(2015,11,20,8,0,0);
  showTime();


  $("div.talk").hide();
  $("#user").focus();

});
