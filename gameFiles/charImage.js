let playerModel = 0;
document.addEventListener('keypress', logKey);
var char = document.getElementById("player");
playerModelClass = '';
setPlayerModelClass();

function setPlayerModelClass() {
    if (playerModel == '0') {
        playerModelClass = 'playerRed';
        char.classList.add(playerModelClass+'--down');
    }
    if (playerModel == '1') {
        playerModelClass = 'playerBlue';
        char.classList.add(playerModelClass);
    }
    if (playerModel == '2') {
        playerModelClass = 'playerGreen';
        char.classList.add(playerModelClass);
    }
    if (playerModel == '3') {
        playerModelClass = 'playerYellow';
        char.classList.add(playerModelClass);
    }
    
}

function playerModelChange(newModelNumber) {
    playerModel = newModelNumber;
    setPlayerModelClass();
}

function logKey(e) {
    if(playerModel == 0) {
        if (e.keyCode === 100 || e.keyCode === 97 || e.keyCode === 119 || e.keyCode === 115) {
            char.classList.remove(playerModelClass+'--left');
            char.classList.remove(playerModelClass+'--right');
            char.classList.remove(playerModelClass+'--up');
            char.classList.remove(playerModelClass+'--down');
        }
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
}