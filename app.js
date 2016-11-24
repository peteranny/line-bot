var express = require('express');
var bodyParser = require('body-parser');
var utf8 = require('utf8');
var crypto = require('crypto');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.urlencoded({extended:false}));

app.post('/callback', function (req, res) {
  console.log('/callback connected');
  const sign = req.headers['X-Line-Signature'];
  const body = req.body;

  const secret = "a97159428f8dd98b12dda1fad43259f0";
  const hmac = crypto.createHmac('sha256', utf8.encode(secret));
  hmac.update(utf8.encode(body));
  const sign2 = hmac.digest('base64');

  console.log(sign);
  console.log(sign2);

  if(sign==sign2){
    res.sendStatus(200);
  }
  else{
    res.sendStatus(403);
  }
  return;
});

app.get('/', function (req, res) {
  console.log('/ connected');
  res.send('Hello!');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

