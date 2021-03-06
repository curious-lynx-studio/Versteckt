document.addEventListener("DOMContentLoaded", function(event) { 
    getLobbyCount();
});

function joinGame() {
    var code = document.getElementById('gameCode').value
    if (code != '') {
        window.location = "./game.html?id="+'"'+code+'"';
    }
}

function getLobbyCount() {
    getData('https://blank42.de:3033/getOnlineLobbys', {})
    .then(data => {
        document.getElementById('lobbysOnline').innerHTML = "Lobbys Online: "+data;
    });
}

function joinRandomGame() {
    getData('https://blank42.de:3033/getPublicLobbys', {})
    .then(data => {
        console.log(data)
        var lobbys = JSON.parse(data);
        if(lobbys.length > 0) {
            var lobbyCode = lobbys[Math.floor(Math.random() * lobbys.length)];
            window.location = "./game.html?id="+'"'+lobbyCode+'"';
        } else {
            startLobby();
        }
    });
}

async function getData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
}