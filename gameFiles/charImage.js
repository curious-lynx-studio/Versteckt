let playerModel = 'hunter';
document.addEventListener('keypress', logKey);
var char = document.getElementById("player");
setPlayerModelClass();

function setPlayerModelClass(oldModel) {
    if (playerModel == 'hunter') {
        try {
            char.classList.remove(oldModel);
            char.classList.add(playerModel+'--down'); 
        } catch (error) {}
    } else {
        try {
            char.className = "player";
            char.classList.remove(oldModel);
            char.classList.add(playerModel);
        } catch (error) {}
    }    
}

function playerModelChange(newModelId) {
    let oldModel = playerModel;
    playerModel = newModelId;
    setPlayerModelClass(oldModel);
}

function resetPlayerModel() {
    let oldModel = playerModel;
    playerModel = 'hunter';
    setPlayerModelClass(oldModel);
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