const Stage = require('./stage');
const Room = require('./room');

module.exports = function(userId, message, push){
    const stage = Stage.prototype.available(userId, push);
    stage.next(message);
}
