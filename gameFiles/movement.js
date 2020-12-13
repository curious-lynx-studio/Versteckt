document.addEventListener("DOMContentLoaded", function(event) { 
    setInterval(function () {
        // get position of div
        var x = parseInt(p1.style.left, 10),
            y = parseInt(p1.style.top, 10);
        
        // update position
        // left/right
        if (keys[keyCodes.left] && canMoveLeft()) {
            x -= 1;
        } else if (keys[keyCodes.right] && canMoveRight()) {
            x += 1;
        }
        // up/down
        if (keys[keyCodes.up] && canMoveUp()) {
            y -= 1;
        } else if (keys[keyCodes.down] && canMoveDown()) {
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

function canMoveLeft() {
    x = parseInt(p1.style.left, 10);
    if (x <= 0) {
        return false;
    } else {
        return true;
    }
}

function canMoveRight() {
    x = parseInt(p1.style.left, 10);
    if (x >= 920) {
        return false;
    } else {
        return true;
    }
}

function canMoveUp() {
    y = parseInt(p1.style.top, 10);
    if (y <= 0) {
        return false;
    } else {
        return true;
    }
}

function canMoveDown() {
    y = parseInt(p1.style.top, 10);
    if (y >= 550) {
        return false;
    } else {
        return true;
    }
}