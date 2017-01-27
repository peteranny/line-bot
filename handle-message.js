const user_stages = {};

function Stage(userId, push){
    this.stage = 'init';
    this.next = function(input){
        switch(this.stage){
            case 'init':
                this.stage = 'confirm-start';
                break;
            case 'confirm-start':
            case 'confirm-start-again':
                if(input == '好'){
                    this.stage = 'sel-role';
                }
                else if(input == '不好'){
                    this.stage = 'exit';
                }
                else{
                    this.stage = 'confirm-start-again';
                }
            case 'sel-role':
                break;
            default:
                console.log('Unknown stage='+this.stage);
        }
    }
    this.reply = function(){
        switch(this.stage){
            case 'confirm-start':
                return '和小風馬兒一起玩好不好?';
            case 'confirm-start-again':
                return '請說「好」或「不好」';
            case 'sel-role':
                return ['請問你要當誰?', '(1) 小風', '(2) 馬兒'].join('\n');
            case 'exit':
                delete user_stages[userId];
                return '小風小馬跟你說掰掰!';
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
