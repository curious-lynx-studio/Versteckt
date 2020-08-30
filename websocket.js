// Let us open a web socket
var ws = new WebSocket("ws://localhost:9998/", 'echo-protocol');

ws.onopen = function() {
    ws.send("Hello i am new!");
};

ws.onmessage = function (evt) { 
    var received_msg = evt.data;
    console.log(received_msg);
};

ws.onclose = function() {   
    // websocket is closed.
    console.log("Connection is closed..."); 
};
