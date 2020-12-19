var p1 = document.getElementById('player');
keyCodes = { left: 'KeyA', up: 'KeyW', right: 'KeyD', down: 'KeyS' };
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
    if (x >= 900) {
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
    if (y >= 800) {
        return false;
    } else {
        return true;
    }
}

setInterval(function () {
    var p1 = document.getElementById('player');
    var world = document.getElementById('gameArea');
    // get position of div
    var x = parseInt(p1.offsetLeft, 10);
    var y = parseInt(p1.offsetTop, 10);
    var xWorld = parseInt(world.offsetLeft, 10);
    var yWorld = parseInt(world.offsetTop, 10);

    // update position
    // left/right
    if (keys[keyCodes.left] && canMoveLeft()) {
        x = x - 1;
        xWorld = xWorld + 1;
    } else if (keys[keyCodes.right] && canMoveRight()) {
        x = x + 1;
        xWorld = xWorld - 1;
    }
    // up/down
    if (keys[keyCodes.up] && canMoveUp()) {
        y = y - 1;
        yWorld = yWorld + 1;
    } else if (keys[keyCodes.down] && canMoveDown()) {
        y = y + 1;
        yWorld = yWorld - 1;
    }
    // set div position
    p1.style.left = x + 'px';
    p1.style.top = y + 'px';

    world.style.left = xWorld + 'px';
    world.style.top = yWorld + 'px';
}, 1/30);