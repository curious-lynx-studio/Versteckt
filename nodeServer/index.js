#!/usr/bin/env node
var WebSocketServer = require('websocket').server;
var http = require('http');
const { client } = require('websocket');

const clientArray = [];
 
var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(9998, function() {
    console.log((new Date()) + ' Server is Online');
});
 
wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});
 
function originIsAllowed(origin) {
  return true;
}
 
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        console.log('Received Message: ' + message.utf8Data);
        if ( message.utf8Data ===  "Hello i am new!") {
            const clientObject = {clientId: Number, clientLastSeen: Number, clientX: Number, clientY: Number}
            client.clientId = generateId();
            client.clientLastSeen = 0;
            client.clientX = 0;
            client.clientY = 0;
            clientArray.push(client);
            connection.sendUTF("id=" + client.clientId);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}