function joinGame() {
    var code = document.getElementById('gameCode').value
    setPlayerName();
    
    window.location = "./game.html?id="+'"'+code+'"';
}

function getLobbyCount() {
    postData('https://blank42.de:3033/getOnlineLobbys')
    .then(data => {
        console.log(data);
    });
}