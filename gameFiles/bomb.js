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
    var bomb = document.createElement("DIV");
    bomb.className = "bomb";
    bomb.style.left = x;
    bomb.style.top = y;
    document.getElementById("gameArea").appendChild(bomb);
    playerBombCount = playerBombCount - 1;
    document.getElementById("bombCount").innerHTML = playerBombCount;
}

function getNewBomb() {
  document.getElementById("bombCount").innerHTML = playerBombCount;
  if (playerBombCount < 3) {
    playerBombCount = playerBombCount + 1;
  }
}