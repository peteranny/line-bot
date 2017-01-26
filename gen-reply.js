module.exports = function(data, next){
    webhook(data, function(reply){
        reply
    });
};

function webhook(data, next){
    const events = data.events;
    events.forEach(function(event){
        const type = event.type;
        const timestamp = event.timestamp;
        const source = event.source;
        const source_type = source.type;
        if(source_type == 'user'){
            const source_id = source.userId;
        }
        else if(source_type == 'group'){
            source_id = source.groupId;
        }
        else if(source_type == 'room'){
            source_id = source.roomId;
        }
        else{
            console.log('Unrecognized source.type='+source_type);
        }
        if(type == 'message'){
            const replyToken = event.replyToken;
            const message = event.message;
            const message_id = message.id;
            const message_type = message.type;
            if(message_type == 'text'){
                const text = message.text;
            }
            else if(message_type == 'image'){
            }
            else if(message_type == 'video'){
            }
            else if(message_type == 'audio'){
            }
            else if(message_type == 'location'){
                const title = message.title;
                const address = message.address;
                const latitude = message.latitude;
                const longitude = message.longitude;
            }
            else if(message_type == 'sticker'){
                const packageId = message.packageId;
                const stickerId = message.stickerId;
            }
        }
        if(type == 'follow'){
            const replyToken = event.replyToken;
        }
        else if(type == 'unfollow'){
        }
        else if(type == 'join'){
            const replyToken = event.replyToken;
        }
        else if(type == 'leave'){
        }
        else if(type == 'postback'){
            const replyToken = event.replyToken;
            const postback_data = event.postback.data;
        }
        else if(type == 'beacon'){
            const replyToken = event.replyToken;
            const beacon_hwid = event.beacon.hwid;
            const beacon_type = event.beacon.type;
            if(beacon_type == 'enter'){
            }
            else if(beacon_type == 'leave'){
            }
            else if(beacon_type == 'banner'){
            }
            else{
                console.log('Unknown beacon.type='+beacon_type);
            }
        }
    });
}

