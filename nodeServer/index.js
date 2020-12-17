// imports
var express = require("express");
var cors = require('cors');
var fs = require('fs');
var http = require('http');
var https = require('https');

//globalVariables
var lobbyArray = [];

// server definition
var app = express();
app.use(cors());

// http & https cert settings
const httpServer = http.createServer(app);
httpServer.listen(3000, () => {
  console.log('HTTP Server running');
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
                    players: jsonData.players, 
                    mode: jsonData.mode
                }
    lobbyArray.push(lobby);
}