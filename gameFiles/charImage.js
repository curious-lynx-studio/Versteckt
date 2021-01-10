let playerModel = 'hunter';
var char = document.getElementById("player");
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