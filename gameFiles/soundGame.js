var ambient = new Audio('./gameAssets/music/menu.wav');
var wrongClick = new Audio('./gameAssets/music/wrongObject.wav');
var goodClick = new Audio('./gameAssets/music/correctObject.wav');
var storageVolume = localStorage.getItem('volume');

document.addEventListener("DOMContentLoaded", function(event) { 
    ambient.volume = storageVolume;
    ambient.play();
});

function wrongClickPlay() {
    wrongClick.volume = storageVolume;
    wrongClick.play();
}

function goodClickPlay() {
    goodClick.volume = storageVolume;
    goodClick.play();
}