$(document).ready(function(){ 
    setInterval(function () {
        // get position of div
        var x = parseInt(p1.style.left, 10),
            y = parseInt(p1.style.top, 10);
        
        // update position
        // left/right
        if (keys[keyCodes.left]) {
            x -= 1;
        } else if (keys[keyCodes.right]) {
            x += 1;
        }
        // up/down
        if (keys[keyCodes.up]) {
            y -= 1;
        } else if (keys[keyCodes.down]) {
            y += 1;
        }
        // set div position
        p1.style.left = x + 'px';
        p1.style.top = y + 'px';
    }, 1/30);
});

var p1 = document.getElementById('player'),
keyCodes = { left: 'KeyA', up: 'KeyW', right: 'KeyD', down: 'KeyS' },
keys = [];

window.addEventListener('keydown', function (evt) {
    keys[evt.code] = true;
});

window.addEventListener('keyup', function (evt) {
    keys[evt.code] = false;
});