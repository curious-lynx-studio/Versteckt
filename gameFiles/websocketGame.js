var socketName = localStorage.getItem('gameLobbyWS');
var webSocket = new WebSocket("ws://blank42.de:9998/socketName");
let id= "";
let lastOtherClientArray;
let playerHealth = 100;
let gameStart = true;

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
            drawBomb(bomb.x, bomb.y, bomb.state);
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

        if(gameStart === true) {
            spawnTheBoss();
            gameStart = false;
        }
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
    if (user.health <= 0) {
        otherPlayerDeathFunction(user.id);
    }
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
    let data = {bombs:{x: x, y: y}, playerId:id};
    webSocket.send(JSON.stringify(data));
}

function drawBomb(x, y, state) {
    var bomb = document.createElement("DIV");
    if(state === "ONE"){
        bomb.className = "bomb bomb--one";
    } else if(state === "TWO"){
        bomb.className = "bomb bomb--two";
    } else if(state === "THREE"){
        bomb.className = "bomb bomb--three";
    } else if(state === "EXPLODED"){
        bomb.className = "bomb bomb--explo";
    } else {
        bomb.className = "bomb bomb--one";
    }
    bomb.id = "bomb";
    bomb.style.left = x;
    bomb.style.top = y;
    document.getElementById("gameArea").appendChild(bomb);
}

function updateOwnHelthbar(user) {
    document.getElementById("playerInnerHealth").style.width = user.health + '%';
    if (user.health <= 0) {
        playerDeathFunction();
    }
}

function removeAllBombsOnGameField() {
    const elements = document.getElementsByClassName("bomb");
    while (elements.length > 0) elements[0].remove();
}