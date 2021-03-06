function Room(){
    this.roomId = Math.random().toString().replace(/\D/g, '');
    this.players = [];
    this.max_nPlayers = 2;
    this.isAvailable = function(){
        return this.players.length < this.max_nPlayers;
    }
    this.isEmpty = function(){
        return this.players.length == 0;
    }
    this.enter = function(player){
        // room -> user
        if(this.isAvailable()){
            this.players.push(player);
            player.enterRoom(this);
            return true;
        }
        return false;
    }
    this.leave = function(player){
        // user -> room
        const i = this.players.indexOf(player);
        if(i >= 0){
            this.players.slice(i, 1);
        }
        if(this.isEmpty()){
            delete Room.prototype.rooms[this.roomId];
        }
    }
    this.has_started = false;
    this.ready = function(){
        if(!this.isAvailable() && !this.has_started){
            return true;
        }
        return false;
    }
    this.start = function(){
        this.hasStarted = true;
        this.broadcast(null, function(player){
            player.next(null, 'enter-room-start');
        });
    }
    this.broadcast = function(user, action){
        this.players.forEach(function(player){
            if(player !== user){
                action(player);
            }
        });
    }
}

Room.prototype.rooms = {};
Room.prototype.available = function(){
    var available = null;
    for(var roomId in Room.prototype.rooms){
        const room = Room.prototype.rooms[roomId];
        if(room.isAvailable()){
            available = room;
            break;
        }
    };
    if(!available) available = new Room();
    return available;
}

module.exports = Room;
