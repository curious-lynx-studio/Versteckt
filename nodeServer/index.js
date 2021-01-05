// imports
var express = require("express");
var cors = require('cors');
var fs = require('fs');
var http = require('http');
var https = require('https');
const WebSocket = require('ws');

//globalVariables
var lobbyArray = [];

// server definition
var app = express();
app.use(cors());

// create WebsocketServer
const wss = new WebSocket.Server({ port: 1337 });

wss.on('connection', function connection(ws) {
  let playerSocket = new SocketContainer(ws);

  ws.on('message', function incoming(message) {
    let msg = JSON.parse(message);
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
  });

  ws.send('something');

  ws.on('close', function(){
    handleConnectionClosed(playerSocket);
  })
});



// http & https cert settings
const httpServer = http.createServer(app);
httpServer.listen(3000, () => {
  console.log('Lobby Server running');
});

// const httpsServer = https.createServer({
//     key: fs.readFileSync('/etc/letsencrypt/live/blank42.de/privkey.pem'),
//     cert: fs.readFileSync('/etc/letsencrypt/live/blank42.de/fullchain.pem'),
//   }, app);
// httpsServer.listen(3030, () => {
//   console.log('HTTPS Server running on port 443');
// });

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

app.post('/newLobby', function (req, res, next) {
  var uniqueId = makeid(6)
  console.log('create new Lobby');
  createLobby(req.body, uniqueId)
  res.json(JSON.stringify(uniqueId));
})

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
                    admin: '',
                    gamePhase: 0,
                    gameCountdown: 0,
                    hitCounter: 0,
                    maxAllowedHits: 0,
                    seeker: [],
                    hiding: [],
                    uncovered: [],
                    players: [],
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
      lobby.players.pop(playerSocket.associatedID)
      lobby.data = lobby.data.filter( obj => obj.playerId !== playerSocket.associatedID);
      console.log("player "+playerSocket.associatedID+" has been removed from the game")
      if (lobby.players.length < 1){
        lobbyArray.pop(lobby);
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
      lobby.gameCountdown = 30;

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
    console.log(lobby);
    if(lobby.id == msg.gameId && lobby.gamePhase == 2) {
      if(!lobby.uncovered.includes(msg.clickedId)) {
        lobby.hitCounter = lobby.hitCounter + 1;
        lobby.uncovered.push(msg.clickedId);
        if (lobby.hitCounter > lobby.maxAllowedHits) {
          lobby.gamePhase = 3; // hiding wins
        }
        if (lobby.seeker.length == lobby.uncovered.length) {
          lobby.gamePhase = 4; // seeker wins
        }
      }
    }
  });
}

function falseClick(msg) {
  lobbyArray.forEach(lobby => {
    console.log(lobby);
    if(lobby.id == msg.gameId && lobby.gamePhase == 2) {
        lobby.hitCounter = lobby.hitCounter + 1;
        if (lobby.hitCounter > lobby.maxAllowedHits) {
          lobby.gamePhase = 3; // hiding wins
        }
    }
  });
}