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
    if (typeof msg !== undefined){
      playerSocket.mostRecentMessage = msg;
    }

    if(playerSocket.associatedID === -1){
      associatePlayer(playerSocket);
    }
    else{
      filterObjectToCorrectLobby(playerSocket)
    }

    let msg = JSON.parse(message);
    lobbyArray.forEach(lobby => {
      if(lobby.id == msg.gameId) {
        ws.send(JSON.stringify(lobby));
      }
    });
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
    var lobby = {   id: uniqueId, 
                    name: jsonData.name, 
                    playerCount: jsonData.players, 
                    mode: jsonData.mode,
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
      console.log(lobby);
      let playerIndex = lobby.data.findIndex(x => x.playerId === player.associatedID);
      if(playerIndex == -1) {
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
      console.log("player "+playerSocket.associatedID+" has been removed from the game")

      if (lobby.players.length < 1){
        lobbyArray.pop(lobby);
        console.log("lobby closed (no player in lobby)")
      }
    }
  })

}