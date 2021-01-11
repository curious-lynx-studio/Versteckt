var ambient = new Audio('./gameAssets/music/menu.wav');
var wrongClick = new Audio('./gameAssets/music/wrongObject.wav');
var goodClick = new Audio('./gameAssets/music/correctObject.wav');
var addObject = new Audio('./gameAssets/music/addObject.wav');
var startGame = new Audio('./gameAssets/music/gameStart.wav');
var move = new Audio('./gameAssets/music/move.wav');
var time = new Audio('./gameAssets/music/time.wav');
var storageVolume = localStorage.getItem('volume');

document.addEventListener("DOMContentLoaded", function(event) { 
    ambient.volume = storageVolume;
    // ambient.play();
});

function wrongClickPlay() {
    wrongClick.volume = storageVolume;
    wrongClick.play();
}

function goodClickPlay() {
    goodClick.volume = storageVolume;
    goodClick.play();
}

function addObjectPlay() {
    addObject.volume = storageVolume;
    addObject.play();
}

function startGamePlay() {
    startGame.volume = storageVolume;
    startGame.play();
}

function movePlay() {
    move.volume = storageVolume;
    move.play();
}

function timePlay() {
    time.volume = storageVolume;
    time.play();
}