var sys = require('util')
var crypto = require('crypto');

function randomValueBase64 (len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, len)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}
var exec = require('child_process').exec;
var child;
var filePath = "img/"+randomValueBase64(7)+".png";

// executes `google-chrome --headless`
var cmd = "touch "+filePath+";google-chrome"+
          " --lang=zh-TW --headless --disable-gpu"+
          " --screenshot='"+filePath+"' --window-size=720,720"+
          " --virtual-time-budget=35000 'http://129.157.178.85:8000/?duration=昨天&region=东北区'"
child = exec(cmd, function (error, stdout, stderr) {

console.log('stdout: ' + stdout);
console.log('stderr: ' + stderr);

  if (error !== null) {
    console.log('exec error: ' + error);
  }
});

