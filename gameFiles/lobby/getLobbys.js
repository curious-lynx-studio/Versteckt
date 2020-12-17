function joinGame() {
    var code = document.getElementById('gameCode').value
    setPlayerName();
    
    window.location = "./game.html?id="+code;
}