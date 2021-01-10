let playerModel = 'hunter';
var char = document.getElementById("player");
document.addEventListener('keypress', logKey);
setPlayerModelClass();

function setPlayerModelClass(oldModel) {
    if (playerModel == 'hunter') {
        try {
            char.classList.remove(oldModel);
            char.classList.add(playerModel); 
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
        if (e.keyCode === 100 || e.keyCode === 97) {
            char.classList.remove(playerModel+'-left');
            char.classList.remove(playerModel+'-right');
        }
        if (e.keyCode === 97) {
            char.classList.add(playerModel+'-left')
        }
        if (e.keyCode === 100) {
            char.classList.add(playerModel+'-right')
        }
    }
    if(playerModel == 'deadPlayer') {
        if (e.keyCode === 100 || e.keyCode === 97) {
            char.classList.remove(playerModel+'-left');
            char.classList.remove(playerModel+'-right');
        }
        if (e.keyCode === 97) {
            char.classList.add(playerModel+'-left')
        }
        if (e.keyCode === 100) {
            char.classList.add(playerModel+'-right')
        }
    }
}