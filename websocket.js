// Let us open a web socket
var ws = new WebSocket("ws://localhost:9998/", 'echo-protocol');
let id= "";

ws.onmessage = function (evt) {
    var received_msg = evt.data;
    if (received_msg.match(/^id=/)) {
        id = received_msg.substring(3);
        console.log(id)
    } else {
        getNetworkJson(received_msg);
    }
};

ws.onclose = function() {   
    // websocket is closed.
    console.log("Connection is closed..."); 
};

function getNetworkJson(received_msg) {
    console.log(received_msg);
}
