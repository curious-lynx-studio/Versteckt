$(document).ready(function(){ 
    var name = localStorage.getItem('playerName');
    if (name != false) {
        document.getElementById('nameInput').value = name;
    }
}) 

function setPlayerName() {
    const name = document.getElementById('nameInput').value;
    localStorage.setItem('playerName', name);
}

function setStdUserName() {
    var name = localStorage.getItem('playerName');
    if (name == '' || name == undefined || name == null) {
        localStorage.setItem('playerName', 'unknownplayer');
    }
}