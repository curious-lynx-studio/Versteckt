let lastX = document.getElementById("player").style.left;
let lastY = document.getElementById("player").style.top;
lastX = lastX.substring(0, lastX.length - 2);
lastY = lastY.substring(0, lastY.length - 2);

function startNotMovedTimer() {
    var sec = 25;
    window.notMovedTimer = setInterval(function() {
        document.getElementById("lastTimeMoved").innerHTML = sec;
        let nowX = document.getElementById("player").style.left;
        let nowY = document.getElementById("player").style.top;
        nowX = nowX.substring(0, nowX.length - 2);
        nowY = nowY.substring(0, nowY.length - 2);
        console.log(nowX, lastX)

        let movedX = false;
        if (!(nowX > lastX-50 && nowX < lastX+50)) {movedX = true}
        let movedY = false;
        if (!(nowY > lastY-50 && nowY < lastY+50)) {movedY = true}

        if(lastX == 0 || lastY == 0) {movedX = true; movedY = true;}
        
        if (movedY || movedX || playerModel == 'deadPlayer' || playerModel == 'deadPlayer-left' || playerModel == 'deadPlayer-right'){
            lastX = nowX;
            lastY = nowY;
            document.getElementById("lastTimeMoved").innerHTML = 25;
            document.getElementById('moveForceCage').style.visibility = 'hidden';
            stopNotMovedTimer();
        } else {
            sec--;
            if (sec == 8) {
                moveMessage();
            }
            if (sec == 10) {
                showCage(lastX, lastY);
            }
            if (sec == 5 || sec == 4 || sec == 3 || sec == 2 || sec == 1) {
                timePlay();
                blinkBorder();
            }
            if (sec == 00) {
                timeOver();
            }
        }
    }, 1000);
}

function stopNotMovedTimer() {
    clearInterval(window.notMovedTimer);
    startNotMovedTimer();
}

function resetNotMoveTimer() {
    document.getElementById("lastTimeMoved").innerHTML = '';
    clearInterval(window.notMovedTimer);
}

function showCage(x, y) {
    document.getElementById('moveForceCage').style.top = y.toString()+'px';
    document.getElementById('moveForceCage').style.left = x.toString()+'px';
    document.getElementById('moveForceCage').style.visibility = 'visible';
}