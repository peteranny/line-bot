var https = require('https');
var bodyParser = require('body-parser');
var express = require('express');

var port = process.env.port || 5000
var app = express();

app.use(express.static(__dirname));

app.use(bodyParser.json());

app.post('/callback', function (req, res) {
  console.log('/callback connected');
  receiver(req, res);
});

app.get('/', function (req, res) {
  console.log('/ connected');
  res.send('Hello!');
});

app.listen(port, function(){
  console.log('listening on port '+port);
});

const secret = "";
function getSign(event) {
  var crypto = require('crypto');
  var body = new Buffer(JSON.stringify(event.body), 'utf8');
  // secret 為您的 Channel secret     
  var hash = crypto.createHmac('sha256', secret).update(body).digest('base64');
  return hash
}

function receiver(req, res) {
  var data = req.body;
  if (getSign(req) == req.get("X-LINE-ChannelSignature")) {
    // ChannelSignature 正確，處理訊息
    console.log('200 OK');
    res.sendStatus(200);
  }
  else{
    console.log('403 Conflict');
    res.sendStatus(403); //ChannelSignature錯誤，回傳403
}
}
