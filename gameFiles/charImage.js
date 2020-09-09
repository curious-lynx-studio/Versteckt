document.addEventListener('keypress', logKey);
var char = document.getElementById("player");

function logKey(e) {
    if (e.keyCode === 97) {
        char.style.backgroundImage = 'url(gameAssets/Character/Char01_Left.png)';
    }
    if (e.keyCode === 100) {
        char.style.backgroundImage = 'url(gameAssets/Character/Char01_Right.png)';
    }
    if (e.keyCode === 119) {
        char.style.backgroundImage = 'url(gameAssets/Character/Char01_Back.png)';
    }
    if (e.keyCode === 115) {
        char.style.backgroundImage = 'url(gameAssets/Character/Char01_Front.png)';
    }
}