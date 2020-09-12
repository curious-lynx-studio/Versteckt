var webSocket = new WebSocket("ws://blank42.de:9998/lobbyList");

webSocket.onmessage = (message) => {
    const obj = JSON.parse(message.data);
    console.log(obj);
}

webSocket.onclose = function() {   
    // websocket is closed.
    console.log("Connection is closed..."); 
};
