$(document).ready(function(){ 
  getNewBomb();
  drawBombCounter();
}) 

document.addEventListener('keydown', logKey);

let playerBombCount = 3;
setInterval(getNewBomb, 5000);

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
  if (playerBombCount < 3) {
    playerBombCount = playerBombCount + 1;
    drawBombCounter();
  }
}

function drawBombCounter() {
  document.getElementById("bombCount").innerHTML = '';
  for(var i = 0; i < playerBombCount; i++) {
    document.getElementById("bombCount").innerHTML += '<div id="bombIcon" class="bombIcon"></div>';
  }
}

function sendBombDropToServer(x,y) {
  x = x.slice(0, -2); 
  y = y.slice(0, -2); 
  x = parseInt(x, 10);
  y = parseInt(y, 10);
  let data = {bombs:{x: x, y: y, plantedBy:id}};
  webSocket.send(JSON.stringify(data));
}

function drawBomb(x, y, state) {
  var bomb = document.createElement("DIV");
  if(state === "ONE"){
      bomb.className = "bomb bomb--one";
  } else if(state === "TWO"){
      bomb.className = "bomb bomb--two";
  } else if(state === "THREE"){
      bomb.className = "bomb bomb--three";
  } else if(state === "EXPLODED"){
      bomb.className = "bomb bomb--explo";
  } else {
      bomb.className = "bomb bomb--one";
  }
  bomb.id = "bomb";
  bomb.style.left = x;
  bomb.style.top = y;
  document.getElementById("gameArea").appendChild(bomb);
}

function removeAllBombsOnGameField() {
  const elements = document.getElementsByClassName("bomb");
  while (elements.length > 0) elements[0].remove();
}