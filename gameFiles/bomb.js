$(document).ready(function(){ 
  getNewBomb();
}) 

document.addEventListener('keydown', logKey);

let playerBombCount = 3;
setInterval(getNewBomb, 10000);

function logKey(event) {
  if (event.keyCode === 32) {
    var x = document.getElementById("player").style.left;
    var y = document.getElementById("player").style.top;
    if (playerBombCount > 0) {
      dropBomb(x, y);
    }
  }
}

function dropBomb(x, y) {
    playerBombCount = playerBombCount - 1;
    drawBombCounter();
    sendBombDropToServer(x, y);
}

function getNewBomb() {
  drawBombCounter();
  if (playerBombCount < 3) {
    playerBombCount = playerBombCount + 1;
  }
}

function drawBombCounter() {
  document.getElementById("bombCount").innerHTML = '';
  for(var i = 0; i < playerBombCount; i++) {
    document.getElementById("bombCount").innerHTML += '<div id="bombIcon" class="bombIcon"></div>';
  }
}