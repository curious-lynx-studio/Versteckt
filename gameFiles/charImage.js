document.addEventListener('keypress', logKey);
var char = document.getElementById("player");

function logKey(e) {
    if (e.keyCode === 97) {
        char.style.backgroundImage = 'url(gameAssets/Character/blue_left.png)';
    }
    if (e.keyCode === 100) {
        char.style.backgroundImage = 'url(gameAssets/Character/blue_right.png)';
    }
    if (e.keyCode === 119) {
        char.style.backgroundImage = 'url(gameAssets/Character/blue_up.png)';
    }
    if (e.keyCode === 115) {
        char.style.backgroundImage = 'url(gameAssets/Character/blue_down.png)';
    }
}