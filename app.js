const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const webhook = require('./webhook');
const reply = require('./reply');
const bot = require('./bot');

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.text({type:'*/*'}));

app.post('/callback', (req, res) => {
    const body = req.body;
    const data = JSON.parse(body);
    console.log('[REQUEST]');
    console.log(JSON.stringify(data));

    const sign = req.headers['x-line-signature'];
    console.log('/callback connected: signature=' + sign);
    if(!verify(sign, body)){
        console.log('Forbidden');
        res.sendStatus(403);
        return;
    }
    else{
        console.log('OK');
        webhook(data, function(err, messages){
            if(err) console.log('ERROR '+err);
            else{
                reply(messages, bot.acc_tok, function(err){
                    if(err) console.log('ERROR '+err.toString());
                    else{
                        console.log('[RESPONSE]');
                        console.log(messages);
                    }
                    res.sendStatus(200);
                });
            }
        });
    }
});

app.get('/', (req, res) => {
    console.log('/ connected');
    res.send('Hello!');
});

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});

function verify(sign, body){
    const hmac = crypto.createHmac('sha256', bot.secret);
    hmac.update(body, 'utf8');
    const sign2 = hmac.digest('base64');
    return sign==sign2;
}

