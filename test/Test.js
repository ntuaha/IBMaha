var a = require("../routes/esb/iQA");
//var expect = require('expect');
var assert = require('assert');

describe('Test iQA',function() {
  it('should be successful',function(done) {
    a.getMessageServer("分行經理是誰",function(data){
      assert.equal(data,'我們分行的經理是蔡國正經理唷!他很親切!大家快來台北分行開戶');
      done();
    });
  });
});
