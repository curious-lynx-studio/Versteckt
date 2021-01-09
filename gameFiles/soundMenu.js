var backgroundMusic = new Audio('./gameAssets/music/menu.wav');

document.addEventListener("DOMContentLoaded", function(event) { 
    var storageVolume = localStorage.getItem('volume');
    if (storageVolume == '' || storageVolume == undefined || storageVolume == null) {
        localStorage.setItem('volume', 0.2);
        storageVolume = localStorage.getItem('volume');
    }
    document.getElementById('volume').value = storageVolume;
    backgroundMusic.volume = localStorage.getItem('volume');
    backgroundMusic.loop=true;
    backgroundMusic.play();
});

function changeVolume() {
    let volumeValue = document.getElementById('volume').value;
    backgroundMusic.volume = volumeValue;
    localStorage.setItem('volume', volumeValue);
}