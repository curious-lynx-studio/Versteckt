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
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}
