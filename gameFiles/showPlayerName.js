document.addEventListener("DOMContentLoaded", function(event) { 
    showPlayerName();
});

function showPlayerName() {
    var char = document.getElementById("player");
    char.innerHTML = localStorage.getItem('playerName');
}