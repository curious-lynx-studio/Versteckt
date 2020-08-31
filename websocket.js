// Let us open a web socket
var webSocket = new WebSocket("ws://blank42.de:9998/positions");
let id= "";

webSocket.onmessage = (message) => {
    if (message.data.match(/^id=/)) {
        console.log("Setting id")
        id = message.data.substring(3);
        var positionSendLoop = setInterval(sendData, 100);
    } else {
        console.log("Writing data")
    }
}

webSocket.onclose = function() {   
    // websocket is closed.
    console.log("Connection is closed..."); 
};

function getNetworkJson(received_msg) {
    console.log(received_msg);
}

function sendData() {
    var x = document.getElementById("player").style.left;
    var y = document.getElementById("player").style.top;
    let data = {id: id, positions: [{x: x, y: y}]};
    webSocket.send(JSON.stringify(data));
}