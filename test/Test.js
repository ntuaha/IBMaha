var a = require("../routes/esb/iQA");
var assert = require('assert');

describe('Test iQA',function() {
  it('via socket',function(done) {
    a.getMessageServer("分行經理是誰",function(data){
      assert.equal(data,'我們分行的經理是蔡國正經理唷!他很親切!大家快來台北分行開戶');
      done();
    });
  });

  it('via web',function(done){
    var req = {
      "query":{}
    };
    req.query.q = "分行經理是誰";
    var res = {
      "json":function(msg){
        assert.equal(msg,"我們分行的經理是蔡國正經理唷!他很親切!大家快來台北分行開戶");
        done();
      }
    };
    a.http(req,res);
  });
});
