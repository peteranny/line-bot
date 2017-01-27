const user_stages = {};

function Stage(userId, push){
    this.stage = 'init';
    this.next = function(input){
        switch(this.stage){
            case 'init':
                this.stage = 'sel-role';
                break;
            default:
                console.log('Unknown stage='+this.stage);
        }
    }
    this.reply = function(){
        switch(this.stage){
            case 'sel-role':
                return ['請問你要當誰?', '(1) 小風', '(2) 馬兒'].join('\n');
            default:
                return 'Unknown stage='+this.stage;
        }
    }
}

module.exports = function(userId, message, push){
    if(!user_stages[userId]){
        user_stages[userId] = new Stage(userId, push);
    }
    const stage = user_stages[userId];
    stage.next(message);
    return stage.reply();
}
