let playerModel = localStorage.getItem('playerModel');
document.addEventListener('keypress', logKey);
var char = document.getElementById("player");
playerModelClass = '';
setPlayerModelClass();

function setPlayerModelClass() {
    if (playerModel == '0') {
        playerModelClass = 'playerRed';
    }
    if (playerModel == '1') {
        playerModelClass = 'playerBlue';
    }
    if (playerModel == '2') {
        playerModelClass = 'playerGreen';
    }
    if (playerModel == '3') {
        playerModelClass = 'playerYellow';
    }
    char.classList.add(playerModelClass+'--down')
}

function logKey(e) {
    char.classList.remove(playerModelClass+'--left');
    char.classList.remove(playerModelClass+'--right');
    char.classList.remove(playerModelClass+'--up');
    char.classList.remove(playerModelClass+'--down');
    if (e.keyCode === 97) {
        char.classList.add(playerModelClass+'--left')
    }
    if (e.keyCode === 100) {
        char.classList.add(playerModelClass+'--right')
    }
    if (e.keyCode === 119) {
        char.classList.add(playerModelClass+'--up')
    }
    if (e.keyCode === 115) {
        char.classList.add(playerModelClass+'--down')
    }
}