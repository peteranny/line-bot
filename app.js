const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.text({type:'*/*'}));

app.post('/callback', (req, res) => {
  console.log('/callback connected: signature=' + req.headers['x-line-signature']);
  if(!verify(req.headers['x-line-signature'], req.body)){
    console.log('Forbidden');
    return res.sendStatus(403);
  }
  console.log('OK');
  return res.sendStatus(200);
});

app.get('/', (req, res) => {
  console.log('/ connected');
  res.send('Hello!');
});

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});

function verify(sign, body){
  const secret = "a97159428f8dd98b12dda1fad43259f0";
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body, 'utf8');
  const sign2 = hmac.digest('base64');
  return sign==sign2;
}

