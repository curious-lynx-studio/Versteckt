document.addEventListener("DOMContentLoaded", function(event) { 
    setPlayerSpawn();
});

function setPlayerSpawn() {
    let playerModel = localStorage.getItem('playerModel');
    var char = document.getElementById("player");
    if (playerModel == '0') {
        char.style.top = "250px"
        char.style.left = "10px"
    }
    if (playerModel == '1') {
        char.style.top = "250px"
        char.style.left = "900px"
    }
    if (playerModel == '2') {
        char.style.top = "0px"
        char.style.left = "460px"
    }
    if (playerModel == '3') {
        char.style.top = "545px"
        char.style.left = "460px"
    }
}