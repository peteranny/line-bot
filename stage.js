const Room = require('./room');

function Stage(userId, push){
    this.stage = 'init';
    this.data = {};
    this.room = null;
    this.enterRoom = function(room){
        // room -> user
        this.room = room;
    }
    this.leaveRoom = function(){
        // user -> room
        if(this.room){
            this.room.leave(this);
            this.room = null;
        }
    }
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
            case 'sel-role-again':
                if(input == '小風'){
                    this.stage = 'confirm-role';
                    this.data.name = '小風';
                }
                else if(input == '馬兒'){
                    this.stage = 'confirm-role';
                    this.data.name = '馬兒';
                }
                else{
                    this.stage = 'sel-role-again';
                }
                break;
            case 'confirm-role':
                this.stage = 'enter-room';
                break;
            case 'enter-room':
            case 'enter-room-wait':
            case 'enter-room-start':
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
                push('請說好或不好');
                return;
            case 'sel-role':
                push('請問你要當小風還是馬兒?');
                return;
            case 'sel-role-again':
                push('請回答小風或馬兒');
                return;
            case 'confirm-role':
                push('你是' + this.data.name);
//                this.next();
                return;
            case 'enter-room':
                this.room = Room.prototype.available();
                if(this.room.ready()){
                    this.room.start();
                }
                else{
                    this.next(null, 'enter-room-wait');
                }
                return;
            case 'enter-room-wait':
                push('再等一下別人加入>8<');
                return;
            case 'enter-room-start':
                push('遊戲開始>8<');
                next(null, 'exit');
                return;
            case 'exit':
                delete Stage.prototype.user_stages[userId];
                push('小風馬兒跟你說掰掰!');
                return;
            case 'timeout':
                push('太久沒回答小風馬兒，小風馬兒走掉了><');
                this.next();
                return;
            default:
                push('Unknown stage='+this.stage);
                return;
        }
    }
}

Stage.prototype.user_stages = {};
Stage.prototype.available = function(userId, push){
    if(!Stage.prototype.user_stages[userId]){
        Stage.prototype.user_stages[userId] = new Stage(userId, push);
    }
    return Stage.prototype.user_stages[userId];
}

module.exports = Stage;
