var https = require('https');
var bodyParser = require('body-parser');
var express = require('express');

var port = process.env.port || 1337
var app = express();
app.use(bodyParser.json());

// 接聽來自Line伺服器中的訊息，交由Function receiver處理
app.post('/callback', function (req, res) {
  receiver(req, res);
});

// 開啟伺服器
https.createServer(app).listen(port);

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
    res.sendStatus(200);
  }
  else
    res.sendStatus(403); //ChannelSignature錯誤，回傳403

}
