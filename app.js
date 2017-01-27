const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const Promise = require('bluebird');
const webhook = require('./webhook');
const runReply = require('./run-reply');
const runPush = require('./run-push');
const handleMessage = require('./handle-message');
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
    }
    else{
        console.log('OK');
        res.sendStatus(200);

        webhook(data, function(err, messages){
            if(err) console.log('ERROR '+err);
            else{
                Promise.map(messages, function(message){
                    console.log('[WEBHOOK]');
                    console.log(message);
                    const replied_text =
                        handleMessage(
                            message.userId,
                            message.text,
                            function(text){
                                runPush(
                                    message.userId,
                                    text,
                                    bot.acc_tok
                                ).then(function(){
                                    console.log('[PUSH DONE]');
                                });
                            }
                        );
                    return runReply(
                        message.replyToken,
                        replied_text,
                        bot.acc_tok
                    ).then(function(){
                        console.log('[REPLY DONE]');
                    });
                }).catch(function(err){
                    console.log('ERROR '+err.toString());
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

