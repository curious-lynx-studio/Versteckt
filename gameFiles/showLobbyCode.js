document.addEventListener("DOMContentLoaded", function(event) { 
    var gameId = urlParams.get('id').slice(1,-1);
    document.getElementById('lobbyCode').innerHTML = 'GameCode: ' + gameId;
});