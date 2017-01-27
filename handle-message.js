module.exports = function(userId, message, push){
    setTimeout(function(){
        push(message);
    }, 1000);
    return 'OK';
}
