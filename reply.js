const Promise = require('bluebird');
const https = require('https');

module.exports = function(messages, acc_tok, next){
    Promise.map(messages, function(one){
        return (new Promise(function(resolve, reject){
            const body = {
                replyToken: one.replyToken,
                messages: [{
                    type: 'text',
                    text: one.message,
                }],
            };
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
                        if(isEmptyObject(json)){
                            resolve();
                        }
                        else{
                            reject(new Error('Reply response not right'));
                        }
                    } catch(err) {
                        reject(err);
                    }
                })
                res.on('error', function(err) {
                    reject(err);
                });
            });
            req.write(JSON.stringify(body));
            req.end();
            req.on('error', function(e) {
                reject(e);
            });
        }))();
    }).then(function(){
        next();
    }, function(err){
        next(err);
    });
}

function isEmptyObject(obj){
    return Object.keys(obj)===0 && obj.constructor===Object;
}
