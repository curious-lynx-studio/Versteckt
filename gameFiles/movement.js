var p1 = document.getElementById('player');
keyCodes = { left: 'KeyA', up: 'KeyW', right: 'KeyD', down: 'KeyS' };
keys = [];
lastKeys = [];
let mapVariable = '1';
let blockedCoords = JSON.parse(map2);
let velocity = 0.0;
let velocityMax = 2.0;
let velocityMin = 0.0;
let acceleration = 0.1;
let lastKey = '';
let neverZeroVelocity;


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
        let x = p1.offsetLeft + 10;
        let y = p1.offsetTop + 40;
        let xWorld = world.offsetLeft;
        let yWorld = world.offsetTop;

        // velocity calculation
        if (keys[keyCodes.left] || keys[keyCodes.right] || keys[keyCodes.up] || keys[keyCodes.down]) {
            velocity += acceleration;

            lastKeys[keyCodes.left] = keys[keyCodes.left];
            lastKeys[keyCodes.right] = keys[keyCodes.right];
            lastKeys[keyCodes.up] = keys[keyCodes.up];
            lastKeys[keyCodes.down] = keys[keyCodes.down];
        } else {
            velocity -= acceleration;
        }

        if (velocity > velocityMax) {
            velocity = velocityMax;
        }
        if (velocity < velocityMin) {
            velocity = velocityMin;
        }

        let xRounded = Math.round(x);
        let yRounded = Math.round(y);

        // update position
        // left/right
        if(velocity > 0.0){
            if(velocity < 1.0){
                neverZeroVelocity = 1;
            }
            else{
                neverZeroVelocity = 2;
            }
            if (lastKeys[keyCodes.left]) {
                const testIfCanMove = {left: xRounded-velocityMax, top: yRounded}
                if (canMove(testIfCanMove)) { 
                    x -= neverZeroVelocity;
                    xWorld += neverZeroVelocity;
                }
            }
            if (lastKeys[keyCodes.right]) {
                const testIfCanMove = {left: xRounded+velocityMax, top: yRounded}
                if (canMove(testIfCanMove)) { 
                    x += neverZeroVelocity;
                    xWorld -= neverZeroVelocity;
                }
            }
            // up/down
            if (lastKeys[keyCodes.up]) {
                const testIfCanMove = {left: xRounded, top: yRounded-velocityMax}
                if (canMove(testIfCanMove)) { 
                    y -= neverZeroVelocity;
                    yWorld += neverZeroVelocity;
                }
            }
            if (lastKeys[keyCodes.down]) {
                const testIfCanMove = {left: xRounded, top: yRounded+velocityMax}
                if (canMove(testIfCanMove)) { 
                    y += neverZeroVelocity;
                    yWorld -= neverZeroVelocity;
                }
            }
        }

        // set div position
        p1.style.left = x-10 + 'px';
        p1.style.top = y-40 + 'px';
    
        world.style.left = xWorld + 'px';
        world.style.top = yWorld + 'px';
    }, 15);
}

// keyboard Eventlistener
window.addEventListener('keydown', function (evt) {
    keys[evt.code] = true;
});

window.addEventListener('keyup', function (evt) {
    keys[evt.code] = false;
});

start();