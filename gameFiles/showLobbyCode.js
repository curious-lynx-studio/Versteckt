document.addEventListener("DOMContentLoaded", function(event) { 
    var gameId = urlParams.get('id').slice(1,-1);
    var streamMode = localStorage.getItem('streamerMode');
    if (streamMode == '0') {
        document.getElementById('lobbyCode').innerHTML = 'GameCode: ' + gameId;
    } else {
        document.getElementById('lobbyCode').innerHTML = 'Copy Game Code';
    }
});

function copyGameCode() {
    copyToClipboard(gameId)
}


function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}
