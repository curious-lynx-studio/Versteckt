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

        if (nowX != lastX || nowY != lastY){
            lastX = nowX;
            lastY = nowY;
            document.getElementById("lastTimeMoved").innerHTML = 30;
            stopNotMovedTimer();
        } else {
            sec--;
            if (sec == 8) {
                moveMessage();
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