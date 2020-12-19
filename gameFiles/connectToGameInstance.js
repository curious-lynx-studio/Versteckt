var socketName = "ws:localhost:1337";
var webSocket = new WebSocket(socketName);
var playerName = localStorage.getItem('playerName');
let playerId = playerName + makeid(6);
let firstMessage = 0;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var gameId = urlParams.get('id').slice(1,-1);
console.log(gameId)

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

webSocket.onmessage = (message) => {
    if (firstMessage == 0) {
        firstMessage = 1;
        let positionSendLoop = setInterval(sendData, 10);
    }
}

webSocket.onclose = function() {   
    // websocket is closed.
    console.log("Connection is closed..."); 
};

function sendData() {
    var x = document.getElementById("player").style.left;
    var y = document.getElementById("player").style.top;
    x = x.substring(0, x.length - 2);
    y = y.substring(0, y.length - 2);
    let data = {gameId: gameId, playerId: playerId, x: x, y: y, name: playerName, characterModel: 0};
    webSocket.send(JSON.stringify(data));
}