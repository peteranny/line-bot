const user_stages = {};

function Stage(userId, push){
    this.stage = 'init';
    this.timer = null;
    this.next = function(input, forceStage){
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
                break;
            case 'sel-role':
                this.stage = 'exit';
                break;
            case 'timeout':
                this.stage = 'exit';
                break;
            default:
                console.log('Unknown stage='+this.stage);
        }
        if(forceStage) this.stage = forceStage;
        this.action();

        // timeout
        if(this.timer) clearTimeout(this.timer);
        if(this.stage !== 'exit'){
            this.timer = setTimeout(function(){
                this.next(null, 'timeout');
            }.bind(this), 10*1000);
        }
    }
    this.action = function(){
        switch(this.stage){
            case 'confirm-start':
                push('和小風馬兒一起玩好不好?');
                return;
            case 'confirm-start-again':
                push('請說「好」或「不好」');
                return;
            case 'sel-role':
                push(['請問你要當誰?', '(1) 小風', '(2) 馬兒'].join('\n'));
                return;
            case 'exit':
                delete user_stages[userId];
                push('小風小馬跟你說掰掰!');
                return;
            case 'timeout':
                push('太久沒回答小風馬兒，小風馬兒走掉了><');
                this.next(null, 'exit');
                return;
            default:
                push('Unknown stage='+this.stage);
                return;
        }
    }
}

module.exports = function(userId, message, push){
    if(!user_stages[userId]){
        user_stages[userId] = new Stage(userId, push);
    }
    const stage = user_stages[userId];
    stage.next(message);
}
