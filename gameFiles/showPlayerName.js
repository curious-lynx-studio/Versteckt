$(document).ready(function(){ showPlayerName(); })

function showPlayerName() {
    var char = document.getElementById("player");
    char.innerHTML = localStorage.getItem('playerName');
}