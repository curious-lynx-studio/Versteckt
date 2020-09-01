// Let us open a web socket
var webSocket = new WebSocket("ws://blank42.de:9998/positions");
let id= "";

webSocket.onmessage = (message) => {
    if (message.data.match(/^id=/)) {
        console.log("Setting id")
        id = message.data.substring(3);
        var positionSendLoop = setInterval(sendData, 100);
    } else {
        const obj = JSON.parse(message.data);
        obj.forEach(user => {
            if(user.id != id) {
                if(document.getElementById(user.id)){
                    updatePlayerObj(user);
                } else {
                    createPlayerObj(user);
                }
            }
        });
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
    x = x.substring(0, x.length - 2);
    y = y.substring(0, y.length - 2);
    let data = {id: id, positions: [{x: x, y: y}]};
    webSocket.send(JSON.stringify(data));
}

function updatePlayerObj(user) {
    const x = user.positions[0].x + "px";
    const y = user.positions[0].y + "px";
    console.log(x,y)
    const otherClient = document.getElementById(user.id);
    otherClient.style.left = x;
    otherClient.style.top = y;
}

function createPlayerObj(user) {
    const x = user.positions[0].x + "px";
    const y = user.positions[0].y + "px";
    console.log(x,y)
    const otherClient = document.createElement("DIV");
    otherClient.className = "otherClient";
    otherClient.id = user.id;
    console.log(user.positions[0].x)
    otherClient.style.left = user.positions[0].x + "px";
    otherClient.style.top = user.positions[0].y + "px";
    document.getElementById("gameArea").appendChild(otherClient);
}