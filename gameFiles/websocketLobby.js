var webSocket = new WebSocket("ws://blank42.de:9998/lobbyList");

webSocket.onmessage = (message) => {
    const obj = JSON.parse(message.data);
    var lobbyTable = document.getElementById("lobbyTable");
    lobbyTable.innerHTML = '';
    obj.forEach(lobby => {
        lobbyTable.innerHTML += '<tr>' +
                                '<th scope="row">'+lobby.lobbyName+'</th>' +
                                '<td>'+lobby.currentPlayerCount+'/'+lobby.maxPlayerCount+'</td>' +
                                '<th scope="row">'+lobby.gameMode+'</th>' +
                                '<td scope="row">'+lobby.passwordSecured+'</td>' +
                                `<td><div class="btn btn-primary" onclick="connectToLobby('`+lobby.lobbyUrl+`')">Join</div></td>` +
                                '</tr>'
    });
}

webSocket.onclose = function() {   
    console.log("Connection is closed..."); 
};

function connectToLobby(lobbyUrl) {
    webSocket.close();
    document.getElementById("body").innerHTML = "";
    var playerName = localStorage.getItem('playerName');
    var password = "";
    var lobbyWebSocket = new WebSocket(lobbyUrl);

    lobbyWebSocket.onopen = function(e) {
        let data = {playerName: playerName, password: password};
        lobbyWebSocket.send(JSON.stringify(data));
    };

    lobbyWebSocket.onmessage = (message) => {
        const obj = JSON.parse(message.data);
        console.log(obj);
    }
}