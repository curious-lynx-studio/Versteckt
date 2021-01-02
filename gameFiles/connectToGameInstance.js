var socketName = "ws:localhost:1337";
var webSocket = new WebSocket(socketName);
var playerName = localStorage.getItem('playerName');
let playerId = playerName + makeid(6);
let firstMessage = 0;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var gameId = urlParams.get('id').slice(1,-1);
const clientsOnline = [];
const playerObjects = [];

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
        let playerDataSendLoop = setInterval(sendData, 10);
    } else {
        const obj = JSON.parse(message.data);
        // setMap(obj);
        obj['data'].forEach((player, index) => {
            if(player.playerId != playerId) {
                if(document.getElementById(player.playerId)){
                    updatePlayerObj(player);
                } else {
                    createPlayerObj(player);
                    clientsOnline.push(player);
                }
            }
            if (player.objects.length > 0) {
                drawObjects(player.objects);
            }
        });

        if ((obj['data'].length - 1) != clientsOnline.length) {
            clientsOnline.forEach(element => {
                const exists = obj['data'].filter(obj => obj.id === element.id);
                if (exists == false) {
                    deleteObject(element.playerId);
                }
            });
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
    let data = {    gameId: gameId, 
                    playerId: playerId, 
                    x: x, y: y, 
                    name: playerName, 
                    characterModel: playerModel,
                    objects: playerObjects
                };
    webSocket.send(JSON.stringify(data));
}

function createPlayerObj(player, index) {
    const x = player.x + "px";
    const y = player.y + "px";
    const otherClient = document.createElement("DIV");
    otherClient.className = "otherClient";
    otherClient.id = player.playerId;
    otherClient.innerHTML = player.name;
    otherClient.style.left = player.x + "px";
    otherClient.style.top = player.y + "px";
    document.getElementById("gameArea").appendChild(otherClient);
    const otherClientId = document.getElementById(player.playerId);
    otherClientId.classList.add(player.characterModel);
}

function updatePlayerObj(player) {
    const x = player.x + "px";
    const y = player.y + "px";
    const otherClient = document.getElementById(player.playerId);
    otherClient.innerHTML = player.name;
    otherClient.style.left = x;
    otherClient.style.top = y;
    otherClient.className = "otherClient";
    otherClient.classList.add(player.characterModel);
}

function deleteObject(element) {
    document.getElementById(element.id).remove();
}

function placeObject(objectClass) {
    var x = document.getElementById("player").style.left;
    var y = document.getElementById("player").style.top;
    x = x.substring(0, x.length - 2);
    y = y.substring(0, y.length - 2);
    let objectId = 'fakeObject-' + makeid(8);
    let object = {x: x, y: y, objectId: objectId, objectClass: objectClass};
    if (playerObjects.length < 20) {
        playerObjects.push(object);
    }
}

function drawObjects(data) {
    data.forEach(objectToDraw => {
        if (!document.getElementById(objectToDraw.objectId)) {
            const objectSpawn = document.createElement("DIV");
            objectSpawn.className = 'object ' + objectToDraw.objectClass;
            objectSpawn.id = objectToDraw.objectId;
            objectSpawn.style.left = objectToDraw.x + "px";
            objectSpawn.style.top = objectToDraw.y + "px";
            document.getElementById("gameArea").appendChild(objectSpawn);
        }
    }); 
}

function setMap(data) {
    if (data.map == '1') {
        var linkElement = this.document.createElement('link');
        linkElement.setAttribute('rel', 'stylesheet');
        linkElement.setAttribute('type', 'text/css');
        linkElement.setAttribute('href', 'imports/map1.css');

        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", "maps/mapBlock.js");
        document.getElementsByTagName("head")[0].appendChild(script);
    }
}