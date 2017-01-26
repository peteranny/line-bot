module.exports = function(data, next){
    const events = data.events;
    try{
        const messages = events.map(function(event){
            const type = event.type;
            const timestamp = event.timestamp;
            const source = event.source;
            const source_type = source.type;
            if(source_type != 'user'){
                throw new Error('Skip non-user type='+type);
            }
            const source_userId = source.userId;
            if(type == 'message'){
                const replyToken = event.replyToken;
                const message = event.message;
                const message_id = message.id;
                const message_type = message.type;
                if(message_type == 'text'){
                    const text = message.text;
                    return {
                        userId: source_userId,
                        message: text,
                    };
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
                    return {
                        replyToken: replyToken,
                        message: stickerId,
                    };
                }
            }
            else{
                throw new Error('Skip non-message event type='+type);
            }
        }).filter(Boolean);
        next(null, messages);
    }catch(err){
        next(err);
    }
}

