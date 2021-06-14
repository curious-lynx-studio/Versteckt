var socketName = "wss:blank42.de:1337";
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
window.gameMap = 0;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var gameId = urlParams.get('id').slice(1,-1);
let clientsOnline = [];
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
        let gamePhaseOfOpenLobby = 0;
        let firstMsgFromServer = JSON.parse(message.data);
        firstMsgFromServer.forEach(lobby => {
            if (lobby.id == gameId) {
                gamePhaseOfOpenLobby = lobby.gamePhase
            }
        });
        if (gamePhaseOfOpenLobby == 0 || gamePhaseOfOpenLobby == 4 || gamePhaseOfOpenLobby == 3) {
            let playerDataSendLoop = setInterval(sendData, 10);
        } else {
            firstMessage = 0;
            let data = {    
                messageType: 'wait',
            };
            webSocket.send(JSON.stringify(data));
        }
    } else {
        const obj = JSON.parse(message.data);
        // check if player is admin
        if (obj.admin == playerId && playerAdminState == false) {
            playerAdminState = true;
            showAdminConsole();
        }
        // set map
        if (obj.map != gameMap) {
            setMap(obj.map);
        }

        // show time count down
        if (obj.gameCountdown != actualGameCounter) {
            actualGameCounter = obj.gameCountdown;
            if (obj.gameCountdown > 0) {
                document.getElementById('timer').innerHTML = obj.gameCountdown;
                if (obj.gameCountdown < 6) {
                    timePlay();
                    blinkBorder();
                }
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
            } else {
                if(obj.uncovered.includes(playerId)) {
                    if (playerModel != 'deadPlayer') {
                        youWhereFoundMessage();
                        playerDead();
                    }
                }
            }
            if (player.objects.length > 0) {
                drawObjects(player.objects);
            }
        });

        // remove offline players
        if ((obj['data'].length - 1) != clientsOnline.length) {
            clientsOnline.forEach((element, index) => {
                const exists = obj['data'].filter(obj => obj.id === element.playerId);
                if (exists == false) {
                    clientsOnline.splice(index, 1);
                    deleteObject(element.playerId);
                }
            });
        }

        drawObjects(obj.randomObjects)
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

    if (seekerList.includes(player.playerId)) {
        otherClient.classList.add('otherClientSeeker');
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
    console.log(object)
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
            addObjectPlay();
        }
    }); 
}

function setMap(map) {
    if (map == '1') {
        window.gameMap = '1';
        document.getElementById('gameArea').classList.remove('map3');
        document.getElementById('gameArea').classList.remove('map5');
        document.getElementById('gameArea').classList.add('map2');
    }
    if (map == '2') {
        window.gameMap = '2';
        document.getElementById('gameArea').classList.remove('map2');
        document.getElementById('gameArea').classList.remove('map5');
        document.getElementById('gameArea').classList.add('map3');
    }
    if (map == '3') {
        window.gameMap = '3';
        document.getElementById('gameArea').classList.remove('map2');
        document.getElementById('gameArea').classList.remove('map3');
        document.getElementById('gameArea').classList.add('map5');
    }
}

function playerDead() {
    playerModelChange('deadPlayer');
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
    document.getElementById('placeObjectsBar').style.visibility = 'visible';
}

function hidePlaceObjectsBar() {
    document.getElementById('placeObjectsBar').style.visibility = 'hidden';
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
    playerModelChange('hunter');
    resetNotMoveTimer();
    removeOldObjects();
    if(playerAdminState) {
        hideAdminConsole();
    }
    if (seeker.includes(playerId)) {
        seekerStatus = true;
        hidePropBar();
        hidePlaceObjectsBar();
        showSeekWaitView();
        document.getElementById('actualState').innerHTML = "You are Seeker!";
        gameStartMessage('seek');
    }
    if (hiding.includes(playerId)) {
        seekerStatus = false;
        showPropBar();
        showPlaceObjectsBar();
        hideSeekWaitView();
        document.getElementById('actualState').innerHTML = "You have to hide!";
        gameStartMessage('hide');
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
        // hidePlaceObjectsBar();
        hideSeekWaitView();
        document.getElementById('actualState').innerHTML = "Good Luck!";
        startNotMovedTimer();
    }
}

function clickedObject(state, id) {
    if (seekerList.includes(playerId)) { 
        if(state) {
            goodClickPlay();
            let data = {    
                messageType: 'trueClick',
                clickedId: id,
                gameId: gameId
            };
            webSocket.send(JSON.stringify(data));
        }
        if(!state) {
            wrongClickPlay();
            let data = {    
                messageType: 'falseClick',
                clickedId: 'false',
                gameId: gameId
            };
            webSocket.send(JSON.stringify(data));
        }
    }
}

function timeOver() {
    let data = {    
        messageType: 'trueClick',
        clickedId: playerId,
        gameId: gameId
    };
    webSocket.send(JSON.stringify(data));
}

function hidingWins() {
    document.getElementById('actualState').innerHTML = "Team Hide WON!";
    hidingWinMessage();
    resetEverything();
}

function seekerWins() {
    document.getElementById('actualState').innerHTML = "Team Seek WON!";
    seekerWinMessage();
    resetEverything();
}

function resetEverything() {
    seekerStatus = false;
    playerObjects = [];
    seekerList = [];
    if(playerAdminState) {
        showAdminConsole();
    }
    hideSeekView();
    hidePlaceObjectsBar();
    resetPlayerModel();
    resetNotMoveTimer();
}

function removeOldObjects() {
    document.querySelectorAll('.object').forEach(function(a){
        a.remove()
    })
}

function playerMorphed() {
    hidePropBar();
}