document.addEventListener('keydown', logKey);

function logKey(event) {
  if (event.keyCode === 32) {
    var x = document.getElementById("player").style.left;
    var y = document.getElementById("player").style.top;
    console.log(x,y)
    dropBomb(x, y);
  }
}

function dropBomb(x, y) {
    var bomb = document.createElement("DIV");
    bomb.style.position = "absolute";
    bomb.style.width = "10px";
    bomb.style.height = "10px";
    bomb.style.left = x;
    bomb.style.top = y;
    bomb.style.background = "black";
    document.getElementById("gameArea").appendChild(bomb);
}