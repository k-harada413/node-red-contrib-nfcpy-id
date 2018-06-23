module.exports = function(RED) {
    'use strict';
    var nfcpyid = require('node-nfcpy-id').default;
    function nfcpyidNode(n) {
        RED.nodes.createNode(this,n);
        this.waitTime = n.waitTime * 1000;
        var node = this;
        var nfc = new nfcpyid({mode:'non-touchend'}).start();
        this.status({fill:"green",shape:"ring",text:"waiting"});
        nfc.on('touchstart', (card) => { 
            try{
                this.status({fill:"green",shape:"dot",text:"touched"});
                setTimeout(() =>{
                    nfc.start();
                    this.status({fill:"green",shape:"ring",text:"waiting"});
                },node.waitTime);

                var msg = {
                    'payload': card.id,
                    'type': card.type,
                    'timestamp': Date.now()
                };

                node.send(msg);
            }catch(err){
                console.log("touch error");
                restart_nfc();
            }
        });

        nfc.on('error', (err) => {
            // standard error output (color is red)
            console.error('\u001b[31m', err, '\u001b[0m');
        });

        node.on('close',function(){
            nfc.pause();
        });
    }
    RED.nodes.registerType("nfcpy-id",nfcpyidNode);


    function restart_nfc(){
        console.log("nfcerror and restartnfc");
        nfc.pause();
        nfc.start();
    }
}