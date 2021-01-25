function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function gameStartMessage(value) {
    const headline = document.getElementById('infoText');
    headline.innerHTML = "GAME START"
    headline.classList.add('animate__animated');
    headline.classList.add('animate__bounceIn');
    startGamePlay();
    await sleep(1000);
    headline.classList.remove('animate__animated');
    headline.classList.remove('animate__bounceIn');
    headline.classList.add('animate__animated');
    headline.classList.add('animate__bounceOut');
    await sleep(1000);
    headline.classList.remove('animate__animated');
    headline.classList.remove('animate__bounceOut');
    headline.innerHTML = ""
    if(value == 'seek') {
        seekerExplainMessage();
    }
}

async function moveMessage() {
    const headline = document.getElementById('infoText');
    headline.innerHTML = "YOU HAVE TO MOVE!!"
    headline.classList.add('animate__animated');
    headline.classList.add('animate__bounceInLeft');
    movePlay();
    await sleep(1500);
    headline.classList.remove('animate__animated');
    headline.classList.remove('animate__bounceInLeft');
    headline.classList.add('animate__animated');
    headline.classList.add('animate__bounceOutRight');
    await sleep(1000);
    headline.classList.remove('animate__animated');
    headline.classList.remove('animate__bounceOutRight');
    headline.innerHTML = ""
}

async function youWhereFoundMessage() {
    const headline = document.getElementById('infoText');
    headline.innerHTML = "PLAYER FOUND!"
    headline.classList.add('animate__animated');
    headline.classList.add('animate__bounceIn');
    await sleep(1000);
    headline.classList.remove('animate__animated');
    headline.classList.remove('animate__bounceIn');
    headline.classList.add('animate__animated');
    headline.classList.add('animate__bounceOut');
    await sleep(1000);
    headline.classList.remove('animate__animated');
    headline.classList.remove('animate__bounceOut');
    headline.innerHTML = ""
}

async function seekerWinMessage() {
    await sleep(2100);
    const headline = document.getElementById('infoText');
    headline.innerHTML = "TEAM SEEK WINS!"
    headline.classList.add('animate__animated');
    headline.classList.add('animate__flipInY');
    startGamePlay();
    await sleep(1000);
    headline.classList.remove('animate__animated');
    headline.classList.remove('animate__flipInY');
    headline.classList.add('animate__animated');
    headline.classList.add('animate__flipOutY');
    await sleep(1000);
    headline.classList.remove('animate__animated');
    headline.classList.remove('animate__flipOutY');
    headline.innerHTML = ""
}

async function hidingWinMessage() {
    await sleep(2100);
    const headline = document.getElementById('infoText');
    headline.innerHTML = "TEAM HIDE WINS!"
    headline.classList.add('animate__animated');
    headline.classList.add('animate__backInDown');
    startGamePlay();
    await sleep(1000);
    headline.classList.remove('animate__animated');
    headline.classList.remove('animate__backInDown');
    headline.classList.add('animate__animated');
    headline.classList.add('animate__backOutDown');
    await sleep(1000);
    headline.classList.remove('animate__animated');
    headline.classList.remove('animate__backOutDown');
    headline.innerHTML = ""
}

async function seekerExplainMessage() {
    const headline = document.getElementById('infoText');
    headline.innerHTML = "After the Countdown, you have to seek the hiding players by clicking on them!"
    headline.classList.add('animate__animated');
    headline.classList.add('animate__bounceInDown');
    await sleep(20000);
    headline.classList.remove('animate__animated');
    headline.classList.remove('animate__bounceInDown');
    headline.classList.add('animate__animated');
    headline.classList.add('animate__bounceOut');
    await sleep(1000);
    headline.classList.remove('animate__animated');
    headline.classList.remove('animate__bounceOut');
    headline.innerHTML = ""
}