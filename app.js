var express = require('express');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.post('/callback', function (req, res) {
  console.log('/callback connected');
  res.sendStatus(200);
});

app.get('/', function (req, res) {
  console.log('/ connected');
  res.send('Hello!');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

