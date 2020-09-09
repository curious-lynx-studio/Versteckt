function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  

async function playerDeathFunction() {
    document.removeEventListener('keypress', logKey);
    document.getElementById("player").className = "playerDeath";
    await sleep(200);
    document.getElementById("gameOverScreen").style.visibility = "visible";
    await sleep(2000);
    window.open("index.html","_self");
}