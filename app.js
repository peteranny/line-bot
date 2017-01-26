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
        res.sendStatus(403);
        return;
    }
    console.log('OK');
    console.log('[REQUEST]');
    console.log(req.body);
    genReply(body, function(reply){
        console.log('[REPLY]');
        console.log(reply);
        res.status(200).json(reply);
    });
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

