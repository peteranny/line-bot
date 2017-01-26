const Promise = require('bluebird');
const https = require('https');

module.exports = function(messages, acc_tok, next){
    Promise.map(messages, function(one){
        return new Promise(function(resolve, reject){
            const options = {
                host: 'api.line.me',
                path: '/v2/bot/message/reply',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + acc_tok,
                },
            };
            const req = https.request(options, function(res) {
                const buf = new Buffer(1024*1024), n = 0;
                res.on('data', function(chunk) {
                    n += buf.write(chunk, n);
                });
                res.on('end', function() {
                    const json = JSON.parse(buf.slice(0,n).toString());
                    if(isEmptyObject(json)){
                        resolve();
                    }
                    else{
                        reject(new Error('Reply response not right'));
                    }
                })
            });
            const body = {
                replyToken: one.replyToken,
                messages: [{
                    type: 'text',
                    text: one.message,
                }],
            };
            req.on('error', function(e) {
                reject(e);
            });
            req.end();
        });
    }).then(function(){
        next();
    }, function(err){
        next(err);
    });
}

function isEmptyObject(obj){
    return Object.keys(json)===0 && json.constructor===Object;
}
