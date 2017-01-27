const https = require('https');
const lib = require('./lib');

module.exports = function sendPush(to, message, acc_tok, next){
    const data = {
        to: to,
        messages: [{
            type: 'text',
            text: message,
        }],
    };
    const body = JSON.stringify(data);
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
                const json = JSON.parse(Buffer.concat(buf).toString());
                if(lib.isEmptyObject(json)){
                    next();
                }
                else{
                    throw new Error(json.message);
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

