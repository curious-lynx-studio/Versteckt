// Let us open a web socket
var webSocket = new WebSocket("ws://blank42.de:9998/positions");
let id= "";
let lastOtherClientArray;
let playerHealth = 100;

webSocket.onmessage = (message) => {
    if (message.data.match(/^id=/)) {
        id = message.data.substring(3);
        var positionSendLoop = setInterval(sendData, 10);
    } else {
        const obj = JSON.parse(message.data);
        obj['players'].forEach(user => {
            if(user.id != id) {
                if(document.getElementById(user.id)){
                    updatePlayerObj(user);
                } else {
                    createPlayerObj(user);
                }
            } else {
                updateOwnHelthbar(user);
            }
        });

        removeAllBombsOnGameField();
        obj['bombs'].forEach(bomb => {
            drawBomb(bomb.x, bomb.y);
        });

        if(lastOtherClientArray != undefined) {
            lastOtherClientArray.forEach(element => {
                const exists = obj['players'].filter(obj => obj.id === element.id);
                if (exists == false) {
                    deleteObject(element);
                }
            });
        }
        lastOtherClientArray = obj['players'];
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
    var playerName = localStorage.getItem('playerName');
    let data = {id: id, x: x, y: y, name: playerName, character: 0, health: playerHealth};
    webSocket.send(JSON.stringify(data));
}

function updatePlayerObj(user) {
    const x = user.x + "px";
    const y = user.y + "px";
    const otherClient = document.getElementById(user.id);
    otherClient.innerHTML = user.name;
    otherClient.style.left = x;
    otherClient.style.top = y;
}

function createPlayerObj(user) {
    const x = user.x + "px";
    const y = user.y + "px";
    const otherClient = document.createElement("DIV");
    otherClient.className = "otherClient";
    otherClient.id = user.id;
    otherClient.innerHTML = user.name;
    otherClient.style.left = user.x + "px";
    otherClient.style.top = user.y + "px";
    document.getElementById("gameArea").appendChild(otherClient);
}

function deleteObject(element) {
    document.getElementById(element.id).remove();
}

function sendBombDropToServer(x,y) {
    x = x.slice(0, -2); 
    y = y.slice(0, -2); 
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    let data = {bombs:{x: x, y: y}};
    webSocket.send(JSON.stringify(data));
}

function drawBomb(x, y) {
    var bomb = document.createElement("DIV");
    bomb.className = "bomb";
    bomb.id = "bomb";
    bomb.style.left = x;
    bomb.style.top = y;
    document.getElementById("gameArea").appendChild(bomb);
}

function updateOwnHelthbar(user) {
    document.getElementById("playerInnerHealth").style.width = user.health + '%';
}

function removeAllBombsOnGameField() {
    const elements = document.getElementsByClassName("bomb");
    while (elements.length > 0) elements[0].remove();
}