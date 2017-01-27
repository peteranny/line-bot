const https = require('https');
const lib = require('./lib');

module.exports = function(replyToken, message, acc_tok, next){
    const data = {
        replyToken: replyToken,
        messages: [{
            type: 'text',
            text: message,
        }],
    };
    const body = JSON.stringify(data);
    console.log('[REPLY]');
    console.log(body);
    const options = {
        host: 'api.line.me',
        path: '/v2/bot/message/reply',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
            'Authorization': 'Bearer ' + acc_tok,
        },
    };
    const req = https.request(options, function(res) {
        const buf = [], n = 0;
        res.on('data', function(chunk) {
            buf.push(chunk);
        });
        res.on('end', function() {
            try{
                const json = Buffer.concat(buf).toString();
                console.log('[RESPONSE]');
                console.log(json);
                const obj = JSON.parse(json);
                if(lib.isEmptyObject(obj)){
                    next();
                }
                else{
                    next(new Error(obj.message));
                }
            } catch(err) {
                next(err);
            }
        })
        res.on('error', function(err) {
            next(err);
        });
    });
    req.write(body);
    req.end();
    req.on('error', function(e) {
        next(e);
    })
}

