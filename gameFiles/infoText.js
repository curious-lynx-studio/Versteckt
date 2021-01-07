function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function gameStartMessage() {
    const headline = document.getElementById('infoText');
    headline.innerHTML = "GAME START"
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

async function moveMessage() {
    const headline = document.getElementById('infoText');
    headline.innerHTML = "YOU HAVE TO MOVE!!"
    headline.classList.add('animate__animated');
    headline.classList.add('animate__bounceInLeft');
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
    headline.innerHTML = "YOU WHERE FOUND!"
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
    const headline = document.getElementById('infoText');
    headline.innerHTML = "TEAM SEEK WINS!"
    headline.classList.add('animate__animated');
    headline.classList.add('animate__flipInY');
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
    const headline = document.getElementById('infoText');
    headline.innerHTML = "TEAM HIDE WINS!"
    headline.classList.add('animate__animated');
    headline.classList.add('animate__backInDown');
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