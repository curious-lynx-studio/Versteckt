var p1 = document.getElementById('player');
keyCodes = { left: 'KeyA', up: 'KeyW', right: 'KeyD', down: 'KeyS' };
keys = [];

// read JSON object from file
function start() {
    // parse JSON object
    const blockedCoords = JSON.parse(map);

    function canMove(testIfCanMove) {
        let blockedValue = true;
        blockedCoords.forEach(coords => {
            if(coords.left == testIfCanMove.left && coords.top == testIfCanMove.top) {
                blockedValue = false;
            }    
        });
        if (blockedValue) {
            return true;
        } else {
            return false;
        }
    }

    // position Loop
    setInterval(function () {
        var p1 = document.getElementById('player');
        var world = document.getElementById('gameArea');
        // get position of div
        var x = (parseInt(p1.offsetLeft, 10)) + 10;
        var y = (parseInt(p1.offsetTop, 10)) + 40;
        var xWorld = parseInt(world.offsetLeft, 10);
        var yWorld = parseInt(world.offsetTop, 10);
    
        // update position
        // left/right
        if (keys[keyCodes.left]) { 
            const testIfCanMove = {left: (x-1), top: y}
            if (canMove(testIfCanMove)) { 
                x = x - 1;
                xWorld = xWorld + 1;
            }
        }

        if (keys[keyCodes.right]) {
            const testIfCanMove = {left: (x+1), top: y}
            if (canMove(testIfCanMove)) { 
                x = x + 1;
                xWorld = xWorld - 1;
            }
        }
        // up/down
        if (keys[keyCodes.up]) {
            const testIfCanMove = {left: x, top: (y-1)}
            if (canMove(testIfCanMove)) { 
                y = y - 1;
                yWorld = yWorld + 1;
            }
        }
        if (keys[keyCodes.down]) {
            const testIfCanMove = {left: x, top: (y+1)}
            if (canMove(testIfCanMove)) { 
                y = y + 1;
                yWorld = yWorld - 1;
            }
        }
        // set div position
        p1.style.left = x-10 + 'px';
        p1.style.top = y-40 + 'px';
    
        world.style.left = xWorld + 'px';
        world.style.top = yWorld + 'px';
    }, 1/30);
}

// keyboard Eventlistener
window.addEventListener('keydown', function (evt) {
    keys[evt.code] = true;
});

window.addEventListener('keyup', function (evt) {
    keys[evt.code] = false;
});

start();