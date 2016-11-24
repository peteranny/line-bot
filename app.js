var https = require('https');
var bodyParser = require('body-parser');
var express = require('express');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());

app.post('/callback', function (req, res) {
  console.log('/callback connected');
  receiver(req, res);
});

app.get('/', function (req, res) {
  console.log('/ connected');
  res.send('Hello!');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

const secret = "81652c23e1e57338595bb40867976a4e";
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
