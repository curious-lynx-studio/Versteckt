var socketName = "ws:localhost:1337";
var webSocket = new WebSocket(socketName);
var playerName = localStorage.getItem('playerName');
let playerId = playerName + makeid(6);
let firstMessage = 0;
let gamePhase = 0;
let playerAdminState = false;
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
        // check if player is admin
        if (obj.admin == playerId && playerAdminState == false) {
            playerAdminState = true;
            showAdminConsole();
        }

        // check if game starts
        if(obj.gamePhase != gamePhase && obj.seeker.length > 0) {
            gamePhase = obj.gamePhase;
            switch (obj.gamePhase) {
                case 1:
                    prepareFirstGamePhase(obj.seeker, obj.hiding);
                    break;
            
                default:
                    break;
            }
        }

        // process other player data
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

        // remove offline players
        if ((obj['data'].length - 1) != clientsOnline.length) {
            clientsOnline.forEach(element => {
                const exists = obj['data'].filter(obj => obj.id === element.playerId);
                if (exists == false) {
                    clientsOnline.pop(element);
                    deleteObject(element.playerId);
                }
            });
        }
    }
}

webSocket.onclose = function() {   
    console.log("Connection is closed..."); 
};

function sendData() {
    var x = document.getElementById("player").style.left;
    var y = document.getElementById("player").style.top;
    x = x.substring(0, x.length - 2);
    y = y.substring(0, y.length - 2);
    let data = {    
                    messageType: 'playerUpdate',
                    gameId: gameId, 
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
    try {
        document.getElementById(element).remove();
    } catch (error) {
        
    }
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

function showAdminConsole() {
    document.getElementById('adminBar').style.display = 'block';
}

function hideAdminConsole() {
    document.getElementById('adminBar').style.display = 'none';
}

function showPropBar() {
    document.getElementById('propMenuBar').style.visibility = 'visible';
}

function hidePropBar() {
    document.getElementById('propMenuBar').style.visibility = 'hidden';
}

function showPlaceObjectsBar() {
    document.getElementById('placeObjectsBar').style.display = 'block';
}

function hidePlaceObjectsBar() {
    document.getElementById('placeObjectsBar').style.display = 'none';
}

function showSeekView() {
    document.getElementById('seekerView').style.display = 'block';
}

function hideSeekView() {
    document.getElementById('seekerView').style.display = 'none';
}

function showSeekWaitView() {
    document.getElementById('seekerWaitView').style.display = 'block';
}

function hideSeekWaitView() {
    document.getElementById('seekerWaitView').style.display = 'none';
}


function startRound() {
    let data = {    
                    messageType: 'startGame',
                    gameId: gameId
                };
    webSocket.send(JSON.stringify(data));
}

function prepareFirstGamePhase(seeker, hiding) {
    if(playerAdminState) {
        hideAdminConsole();
    }
    if (seeker.includes(playerId)) {
        hidePropBar();
        hidePlaceObjectsBar();
        showSeekWaitView();
        document.getElementById('gameState').innerHTML = "You are Seeker!";
    }
    if (hiding.includes(playerId)) {
        showPropBar();
        showPlaceObjectsBar();
        hideSeekWaitView();
        document.getElementById('gameState').innerHTML = "You have to hide!";
    }
}