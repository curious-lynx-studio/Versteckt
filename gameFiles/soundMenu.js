var backgroundMusic = new Audio('./gameAssets/music/menu.wav');
backgroundMusic.volume = 0.2;
backgroundMusic.play();

function changeVolume() {
    let volumeValue = document.getElementById('volume').value;
    backgroundMusic.volume = volumeValue;
}