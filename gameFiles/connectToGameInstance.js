var socketName = "ws:localhost:1337";
var webSocket = new WebSocket(socketName);
var playerName = localStorage.getItem('playerName');
let playerId = playerName + makeid(6);
let firstMessage = 0;
let gamePhase = 0;
let actualGameCounter = 0;
let playerAdminState = false;
let seekerStatus = false;
let lobbyMaxAllowedHits = 0;
let lobbyHitCounter = 0;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var gameId = urlParams.get('id').slice(1,-1);
const clientsOnline = [];
let playerObjects = [];
let seekerList = [];

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

        // show time count down
        if (obj.gameCountdown != actualGameCounter) {
            actualGameCounter = obj.gameCountdown;
            if (obj.gameCountdown > 0) {
                document.getElementById('timer').innerHTML = obj.gameCountdown;
            } else {
                document.getElementById('timer').innerHTML = '';
            }
        }

        // show hit count down
        if (obj.maxAllowedHits != lobbyMaxAllowedHits) {
            lobbyMaxAllowedHits = obj.maxAllowedHits;
            document.getElementById('maxHits').innerHTML = lobbyMaxAllowedHits;
        }
        if (obj.hitCounter != lobbyHitCounter) {
            lobbyHitCounter = obj.hitCounter;
            document.getElementById('hitsClicked').innerHTML = lobbyHitCounter;
        }

        // check if game starts
        if(obj.gamePhase != gamePhase && obj.seeker.length > 0) {
            gamePhase = obj.gamePhase;
            switch (obj.gamePhase) {
                case 1:
                    prepareFirstGamePhase(obj.seeker, obj.hiding);
                    break;
                
                case 2:
                    prepareSecondGamePhase(obj.seeker, obj.hiding);
                    break;

                case 3:
                    hidingWins(obj);
                    break;
                
                case 4:
                    seekerWins(obj);
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
    otherClient.onclick=function(){clickedObject(true, player.playerId)}
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

    // show or hide names if you are the seeker or not
    if (seekerStatus == true) {
        otherClient.style.fontSize = '0';
    } else {
        otherClient.style.fontSize = '14';
    }
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
    if (playerObjects.length < 30) {
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
            objectSpawn.onclick=function(){clickedObject(false, '')}
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
        seekerStatus = true;
        hidePropBar();
        hidePlaceObjectsBar();
        showSeekWaitView();
        document.getElementById('actualState').innerHTML = "You are Seeker!";
    }
    if (hiding.includes(playerId)) {
        seekerStatus = false;
        showPropBar();
        showPlaceObjectsBar();
        hideSeekWaitView();
        document.getElementById('actualState').innerHTML = "You have to hide!";
    }
}

function prepareSecondGamePhase(seeker, hiding) {
    seekerList = seeker;
    if(playerAdminState) {
        hideAdminConsole();
    }
    if (seeker.includes(playerId)) {
        seekerStatus = true;
        hidePropBar();
        hidePlaceObjectsBar();
        hideSeekWaitView();
        showSeekView();
        document.getElementById('actualState').innerHTML = "Go and Seek!";
    }
    if (hiding.includes(playerId)) {
        seekerStatus = false;
        hidePropBar();
        hidePlaceObjectsBar();
        hideSeekWaitView();
        document.getElementById('actualState').innerHTML = "Good Luck!";
    }
}

function clickedObject(state, id) {
    if (seekerList.includes(playerId)) { 
        if(state) {
            let data = {    
                messageType: 'trueClick',
                clickedId: id,
                gameId: gameId
            };
            webSocket.send(JSON.stringify(data));
        }
        if(!state) {
            let data = {    
                messageType: 'falseClick',
                clickedId: 'false',
                gameId: gameId
            };
            webSocket.send(JSON.stringify(data));
        }
    }
}

function hidingWins() {
    document.getElementById('actualState').innerHTML = "Team Hide WON!";
    resetEverything();
}

function seekerWins() {
    document.getElementById('actualState').innerHTML = "Team Seek WON!";
    resetEverything();
}

function resetEverything() {
    seekerStatus = false;
    playerObjects = [];
    if(playerAdminState) {
        showAdminConsole();
    }
    hideSeekView();
}