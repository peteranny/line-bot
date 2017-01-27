const handleMessage = require('./handle-message');

console.log('Enter [userId] [message]');

const stdin = process.openStdin();
stdin.addListener('data', function(d) {
    const parts = d.toString().trim().split(' ').filter(Boolean);
    if(parts.length!=2){
        console.log('Invalid event');
    }
    else{
        handleMessage(parts[0], parts[1], function(data){
            console.log('To '+parts[0]+' '+data);
        });
    }
});
