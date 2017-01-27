module.exports = {
    isEmptyObject: function(obj){
        return Object.keys(obj).length===0 && obj.constructor===Object;
    },
    log: function(){
        const msg = Array.from(arguments).reduce(function(a,b){
            return a + (
                b instanceof Error? b.toString():
                typeof b == 'object'? JSON.stringify(b, null, 2):
                b
            );
        }, '');
        console.log(msg);
    },
}
