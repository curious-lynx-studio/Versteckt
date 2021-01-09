var p1 = document.getElementById('player');
keyCodes = { left: 'KeyA', up: 'KeyW', right: 'KeyD', down: 'KeyS' };
keys = [];
let mapVariable = '1';
let blockedCoords = JSON.parse(map2);
let velocity = 0.6;
let velocityMax = 1.4;
let velocityMin = 0.6;


// read JSON object from file
function start() {
    // parse JSON object
    
    function canMove(testIfCanMove) {
        if (window.gameMap != mapVariable) {
            mapVariable = window.gameMap;
            if (window.gameMap == '1') {
                blockedCoords = JSON.parse(map2);
            }
            if (window.gameMap == '2') {
                blockedCoords = JSON.parse(map3);
            }
        }
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

        let p1 = document.getElementById('player');
        let world = document.getElementById('gameArea');
        // get position of div
        let x = (parseInt(p1.offsetLeft, 10)) + 10;
        let y = (parseInt(p1.offsetTop, 10)) + 40;
        let xWorld = parseInt(world.offsetLeft, 10);
        let yWorld = parseInt(world.offsetTop, 10);
        // velocity calculation
        if (keys[keyCodes.left] || keys[keyCodes.right] || keys[keyCodes.up] || keys[keyCodes.down]) {
            velocity += 0.01;
            console.log(velocity);
        } else {
            velocity -= 0.01;
        }

        if (velocity > velocityMax) {
            velocity = velocityMax;
        }
        if (velocity < velocityMin) {
            velocity = velocityMin;
        }

        let endPosition = parseInt(Math.round(velocity), 10);
        let xRounded = Math.round(x);
        let yRounded = Math.round(y);

        // update position
        // left/right
        if (keys[keyCodes.left]) { 
            const testIfCanMove = {left: (xRounded-endPosition), top: yRounded}
            if (canMove(testIfCanMove)) { 
                x = x - velocity;
                xWorld = xWorld + velocity;
            }
        }

        if (keys[keyCodes.right]) {
            const testIfCanMove = {left: (xRounded+endPosition), top: yRounded}
            if (canMove(testIfCanMove)) { 
                x = x + velocity;
                xWorld = xWorld - velocity;
            }
        }
        // up/down
        if (keys[keyCodes.up]) {
            const testIfCanMove = {left: xRounded, top: (yRounded-endPosition)}
            if (canMove(testIfCanMove)) { 
                y = y - velocity;
                yWorld = yWorld + velocity;
            }
        }
        if (keys[keyCodes.down]) {
            const testIfCanMove = {left: xRounded, top: (yRounded+endPosition)}
            if (canMove(testIfCanMove)) { 
                y = y + velocity;
                yWorld = yWorld - velocity;
            }
        }
        // set div position
        p1.style.left = x-10 + 'px';
        p1.style.top = y-40 + 'px';
    
        world.style.left = xWorld + 'px';
        world.style.top = yWorld + 'px';
    }, 7);
}

// keyboard Eventlistener
window.addEventListener('keydown', function (evt) {
    keys[evt.code] = true;
});

window.addEventListener('keyup', function (evt) {
    keys[evt.code] = false;
});

start();