// imports
var express = require("express");
var cors = require('cors');
var fs = require('fs');
var http = require('http');
var https = require('https');
const WebSocket = require('ws');

var privateKey = fs.readFileSync('/etc/letsencrypt/live/blank42.de/privkey.pem');
var certificate = fs.readFileSync('/etc/letsencrypt/live/blank42.de/fullchain.pem');
var credentials = { key: privateKey, cert: certificate };

// create https server for secure websocket connection
var wsshttpsServer = https.createServer(credentials);
wsshttpsServer.listen(1337);

//globalVariables
var lobbyArray = [];

// server definition
var app = express();
app.use(cors());

// http & https cert settings
const httpServer = http.createServer(app);
httpServer.listen(3003, () => {
  console.log('Lobby Server running');
});

const httpsServer = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/blank42.de/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/blank42.de/fullchain.pem'),
  }, app);
httpsServer.listen(3033, () => {
  console.log('HTTPS Server running on port 443');
});

// body parse function
var bodyParser = require('body-parser');
const { clearInterval } = require("timers");
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(bodyParser.text({ limit: '200mb' }));

// listener
app.get('/getLobby', function (req, res, next) {
  console.log("Send all Lobby Infos");
  res.json(JSON.stringify(lobbyArray));
})

app.get('/getOnlineLobbys', function (req, res, next) {
  console.log("Send Lobbys Online");
  res.json(JSON.stringify(lobbyArray.length));
})

app.get('/getPublicLobbys', function (req, res, next) {
  console.log("Get all public Lobbys");
  var publicLobbys = []
  lobbyArray.forEach(lobby => {
    if (lobby.private == false) {
      publicLobbys.push(lobby.id)
    }
  });
  res.json(JSON.stringify(publicLobbys));
})

app.post('/newLobby', function (req, res, next) {
  var uniqueId = makeid(6)
  console.log('create new Lobby');
  createLobby(req.body, uniqueId)
  res.json(JSON.stringify(uniqueId));
})

// create WebsocketServer
// const wss = new WebSocket.Server({httpsServer, port: 1337});
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
    server: wsshttpsServer
});

wss.on('connection', function connection(ws) {
  let playerSocket = new SocketContainer(ws);

  ws.on('message', function incoming(message) {
    let msg = JSON.parse(message);
    if (msg.messageType == 'wait') {
      ws.send(JSON.stringify(lobbyArray));
    } else {
      switch (msg.messageType) {
        case 'startGame':
          startGameForLobby(msg);
          break;
        case 'trueClick':
          trueClick(msg);
          break;
        case 'falseClick':
          falseClick(msg);
          break;
        default:
          if (typeof msg !== undefined){
            playerSocket.mostRecentMessage = msg;
          }
      
          if(playerSocket.associatedID === -1){
            associatePlayer(playerSocket);
          }
          else{
            filterObjectToCorrectLobby(playerSocket)
          }
      
          lobbyArray.forEach(lobby => {
            if(lobby.id == msg.gameId) {
              ws.send(JSON.stringify(lobby));
            }
          });
          break;
      }
    }
  });

  ws.send(JSON.stringify(lobbyArray));

  ws.on('close', function(){
    handleConnectionClosed(playerSocket);
  })
});

// functions
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function createLobby(jsonData, uniqueId) {
    var lobby = {   
                    id: uniqueId, 
                    name: jsonData.name, 
                    map: jsonData.map,
                    private: jsonData.private,
                    admin: '',
                    gamePhase: 0,
                    gameCountdown: 0,
                    hitCounter: 0,
                    maxAllowedHits: 0,
                    seeker: [],
                    hiding: [],
                    uncovered: [],
                    players: [],
                    randomObjects: [],
                    data: []
                }
    lobbyArray.push(lobby);
}

function associatePlayer(playerSocket){;
  playerSocket.associatedID = playerSocket.mostRecentMessage.playerId;
  lobbyArray.forEach(lobby => {
    if(lobby.id===playerSocket.mostRecentMessage.gameId){
      lobby.players.push(playerSocket.associatedID);
    }
  })
}

//check, whether player wants to cheat via changing player name (compare sent name with socket-associated name)
function filterObjectToCorrectLobby(player) {
  let msg = player.mostRecentMessage;
  lobbyArray.forEach(lobby => {
    if(lobby.id == msg.gameId) {
      let playerIndex = lobby.data.findIndex(x => x.playerId === player.associatedID);
      if(playerIndex == -1) {
        if (lobby.data.length == 0) {
          lobby.admin = player.associatedID;
        }
        lobby.data.push(msg);
      } else {
        lobby.data[playerIndex] = msg;
      }
    }
  });
}
//contains socket and corresponding data
class SocketContainer{
  associatedID = -1;
  socket;
  mostRecentMessage;
  constructor(socket){
    this.socket = socket;
  }
}

function handleConnectionClosed(playerSocket){
  let lastMessage = playerSocket.mostRecentMessage;
  
  lobbyArray.forEach(lobby => {
    if(lobby.id===lastMessage.gameId){
      lobby.players.forEach((player, index) => {
        if(player === playerSocket.associatedID) {
          lobby.players.splice(index, 1);
        }
      });
      lobby.data = lobby.data.filter( obj => obj.playerId !== playerSocket.associatedID);
      lobby.hiding.forEach((playerHidingId, index) => {
        if (playerHidingId === playerSocket.associatedID) {
          lobby.hiding.splice(index, 1);
        }
      });
      console.log("player "+playerSocket.associatedID+" has been removed from the game")
      console.log(lobby.players.length);
      if (lobby.players.length < 1){
        lobbyArray.forEach((lobbyInArray, index) => {
          if(lobbyInArray.id == lobby.id) {
            lobbyArray.splice(index, 1);
          }
        });
        console.log("lobby closed (no player in lobby)")
      }
    }
  })

}

function startGameForLobby(msg) {
  lobbyArray.forEach(lobby => {
    if(lobby.id == msg.gameId && lobby.data.length > 1) {
      lobby.gamePhase = 1;
      lobby.seeker = [];
      lobby.hiding = [];
      lobby.uncovered = [];
      lobby.hitCounter = 0;
      lobby.maxAllowedHits = 0;
      let playerCount = lobby.data.length;
      let seekerNumber = Math.round(playerCount / 6);
      if (seekerNumber < 1) { seekerNumber = 1 };

      // get all random seeker into the seeker array
      let seekerArray = lobby.data;
      let shuffled = seekerArray.sort(function(){return .5 - Math.random()});
      let selected=shuffled.slice(0,seekerNumber);
      selected.forEach(player => {
        lobby.seeker.push(player.playerId);
      });

      // get all hiding player to the hiding array
      lobby.data.forEach(player => {
        if(!lobby.seeker.includes(player.playerId)) {
          lobby.hiding.push(player.playerId);
        }
      });

      // start game countdown
      lobby.gameCountdown = 45;
      
      setRandomGameObjects(lobby);

      let timerId = setInterval(function() {
        if (lobby.gameCountdown == 0) {
          lobby.gamePhase = 2;
          lobby.hitCounter = 0;
          lobby.maxAllowedHits = (lobby.hiding.length * 3);
          startSecondGamePhase(lobby.id);
          clearInterval(timerId);
        } else {
          lobby.gameCountdown = lobby.gameCountdown - 1;
        }
      }, 1000);
    }
  });
}

function startSecondGamePhase(lobbyId) {
  lobbyArray.forEach(lobby => {
    if(lobby.id == lobbyId && lobby.gamePhase == 2) {
      // init second game phase with 300 seconds
      lobby.gameCountdown = 300;
      let timerId = setInterval(function() {
        lobbyArray.forEach(realLobby => {
          if (realLobby.id == lobby.id) {
            if (realLobby.gamePhase != 2) {
              lobby.gameCountdown = 0;
              lobby.gamePhase = realLobby.gamePhase;
              clearInterval(timerId);
            }
          }
        });
        if (lobby.gameCountdown == 0 && lobby.gamePhase == 2) {
          lobby.gamePhase = 3;
          clearInterval(timerId);
        } else {
          lobby.gameCountdown = lobby.gameCountdown - 1;
        }
      }, 1000);
    }
  });
}

function trueClick(msg) {
  
  lobbyArray.forEach(lobby => {
    if(lobby.id == msg.gameId && lobby.gamePhase == 2) {
      if(!lobby.uncovered.includes(msg.clickedId)) {
        lobby.hitCounter = lobby.hitCounter + 1;
        lobby.uncovered.push(msg.clickedId);
        if (lobby.hitCounter >= lobby.maxAllowedHits) {
          lobby.gamePhase = 3; // hiding wins
        }
        if (lobby.hiding.length == lobby.uncovered.length) {
          lobby.gamePhase = 4; // seeker wins
        }
      }
    }
  });
}

function falseClick(msg) {
  lobbyArray.forEach(lobby => {
    if(lobby.id == msg.gameId && lobby.gamePhase == 2) {
        lobby.hitCounter = lobby.hitCounter + 1;
        if (lobby.hitCounter >= lobby.maxAllowedHits) {
          lobby.gamePhase = 3; // hiding wins
        }
    }
  });
}

function setRandomGameObjects(lobby) {
  console.log(lobby);
  lobby.randomObjects = [];

  if(lobby.map == '2') {
    var objectListTable = [
      {x: "575", y: "140", objectId: "fakeObject-decoy001", objectClass: "prop23"},
      {x: "420", y: "140", objectId: "fakeObject-decoy002", objectClass: "prop23"},
      {x: "250", y: "140", objectId: "fakeObject-decoy003", objectClass: "prop23"},
      {x: "140", y: "140", objectId: "fakeObject-decoy004", objectClass: "prop23"}
    ]
  
    var objectListDresser = [
      {x: "213", y: "88", objectId: "fakeObject-decoy005", objectClass: "prop12"},
      {x: "307", y: "88", objectId: "fakeObject-decoy006", objectClass: "prop12"},
      {x: "145", y: "88", objectId: "fakeObject-decoy007", objectClass: "prop12"},
      {x: "51", y: "88" , objectId: "fakeObject-decoy008", objectClass: "prop12"},
      {x: "397", y: "88", objectId: "fakeObject-decoy009", objectClass: "prop12"},
      {x: "533", y: "88", objectId: "fakeObject-decoy010", objectClass: "prop12"},
      {x: "632", y: "88", objectId: "fakeObject-decoy011", objectClass: "prop12"}
    ]
  
    var objectListBonsai = [
      {x: "637", y: "200", objectId: "fakeObject-decoy012", objectClass: "prop21"},
      {x: "523", y: "200", objectId: "fakeObject-decoy013", objectClass: "prop20"},
      {x: "478", y: "200", objectId: "fakeObject-decoy014", objectClass: "prop21"},
      {x: "360", y: "200", objectId: "fakeObject-decoy015", objectClass: "prop21"},
      {x: "316", y: "200", objectId: "fakeObject-decoy016", objectClass: "prop20"},
      {x: "200", y: "200", objectId: "fakeObject-decoy017", objectClass: "prop21"},
      {x: "155", y: "200", objectId: "fakeObject-decoy018", objectClass: "prop20"},
      {x:  "40", y: "200", objectId: "fakeObject-decoy019", objectClass: "prop21"}
    ]
  
    var objectListCloset = [
      {x: "667", y: "-8", objectId: "fakeObject-decoy020", objectClass: "prop36"},
      {x: "500", y: "-8", objectId: "fakeObject-decoy021", objectClass: "prop36"},
      {x: "300", y: "-8", objectId: "fakeObject-decoy022", objectClass: "prop36"},
      {x: "100", y: "-8", objectId: "fakeObject-decoy023", objectClass: "prop36"}
    ]

    var singleObjects = [
      {x: "463", y: "-8", objectId: "fakeObject-decoy024", objectClass: "prop35"},
      {x: "234", y: "197", objectId: "fakeObject-decoy025", objectClass: "prop39"},
      {x: "548", y: "139", objectId: "fakeObject-decoy026", objectClass: "prop17"},
      {x: "601", y: "139", objectId: "fakeObject-decoy027", objectClass: "prop17"},
      {x: "479", y: "144", objectId: "fakeObject-decoy028", objectClass: "prop15"},
      {x: "316", y: "145", objectId: "fakeObject-decoy029", objectClass: "prop9"},
      {x: "-3", y: "22", objectId: "fakeObject-decoy030", objectClass: "prop2"},
      {x: "-3", y: "49", objectId: "fakeObject-decoy031", objectClass: "prop2"},
      {x: "679", y: "22", objectId: "fakeObject-decoy032", objectClass: "prop2"},
      {x: "679", y: "42", objectId: "fakeObject-decoy033", objectClass: "prop2"}
    ]

  
    objectListDresser.forEach(dresser => {
      var random_boolean = Math.random() < 0.5;
      if (random_boolean) {
        lobby.randomObjects.push(dresser);
      }
    });
  
    objectListTable.forEach(table => {
      var random_boolean = Math.random() < 0.5;
      if (random_boolean) {
        lobby.randomObjects.push(table);
      }
    });
  
    objectListBonsai.forEach(bonsai => {
      var random_boolean = Math.random() < 0.5;
      if (random_boolean) {
        lobby.randomObjects.push(bonsai);
      }
    });
  
    objectListCloset.forEach(closet => {
      var random_boolean = Math.random() < 0.5;
      if (random_boolean) {
        lobby.randomObjects.push(closet);
      }
    });

    singleObjects.forEach(object => {
      var random_boolean = Math.random() < 0.5;
      if (random_boolean) {
        lobby.randomObjects.push(object);
      }
    });
  }
}