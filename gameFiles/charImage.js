let playerModel = 'hunter';
document.addEventListener('keypress', logKey);
var char = document.getElementById("player");
setPlayerModelClass();

function setPlayerModelClass() {
    if (playerModel == 'hunter') {
        char.classList.add(playerModel+'--down');
    } else {
        char.className = "player";
        char.classList.add(playerModel);
    }    
}

function playerModelChange(newModelId) {
    playerModel = newModelId;
    setPlayerModelClass();
}

function logKey(e) {
    if(playerModel == 'hunter') {
        if (e.keyCode === 100 || e.keyCode === 97 || e.keyCode === 119 || e.keyCode === 115) {
            char.classList.remove(playerModel+'--left');
            char.classList.remove(playerModel+'--right');
            char.classList.remove(playerModel+'--up');
            char.classList.remove(playerModel+'--down');
        }
        if (e.keyCode === 97) {
            char.classList.add(playerModel+'--left')
        }
        if (e.keyCode === 100) {
            char.classList.add(playerModel+'--right')
        }
        if (e.keyCode === 119) {
            char.classList.add(playerModel+'--up')
        }
        if (e.keyCode === 115) {
            char.classList.add(playerModel+'--down')
        }
    }
}