var socketName = localStorage.getItem('gameLobbyWS');
var gameMode = localStorage.getItem('gameMode');
var webSocket = new WebSocket(socketName);
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
        obj['players'].forEach((user, index) => {
            if(user.id != id) {
                if(document.getElementById(user.id)){
                    updatePlayerObj(user);
                } else {
                    createPlayerObj(user, index);
                }
            } else {
                updateOwnHelthbar(user);
            }
        });
        checkGameMode();
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

function createPlayerObj(user, index) {
    const x = user.x + "px";
    const y = user.y + "px";
    const otherClient = document.createElement("DIV");
    otherClient.className = "otherClient";
    otherClient.id = user.id;
    otherClient.innerHTML = user.name;
    otherClient.style.left = user.x + "px";
    otherClient.style.top = user.y + "px";
    document.getElementById("gameArea").appendChild(otherClient);
    const otherClientId = document.getElementById(user.id);
    if (index == 0) {
        otherClientId.classList.add('playerRed--down')
    }
    if (index == 1) {
        otherClientId.classList.add('playerBlue--down')
    }
    if (index == 2) {
        otherClientId.classList.add('playerGreen--down')
    }
    if (index == 3) {
        otherClientId.classList.add('playerYellow--down')
    }
}

function deleteObject(element) {
    document.getElementById(element.id).remove();
}

function checkGameMode() {
    if(gameStart === true) {
        if (gameMode == "DEATHMATCH") {
            console.log("Deathmatch")
        }
        if (gameMode == "SCOREHUNTER") {
            spawnTheBoss();
        }
        gameStart = false;
    }
}