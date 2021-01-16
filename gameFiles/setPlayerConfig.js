document.addEventListener("DOMContentLoaded", function(event) { 
    var name = localStorage.getItem('playerName');
    if (name != false) {
        document.getElementById('nameInput').value = name;
    }
    localStorage.setItem('streamerMode', '0');
    document.getElementById('streamerMode').innerHTML = "Streamer Mode is OFF";
});

function setPlayerName() {
    let name = document.getElementById('nameInput').value;
    name = name.replace(/[^a-zA-Z0-9]/g,'');
    name = name.substring(0, 13);
    localStorage.setItem('playerName', name);
}

function setStdUserName() {
    var name = localStorage.getItem('playerName');
    if (name == '' || name == undefined || name == null) {
        localStorage.setItem('playerName', 'unknownplayer');
    }
}

function closeApp() {
    window.close();
    window.location.href = 'https://versteckt.blank42.de/';
}

function toggleStreamerMode() {
    var streamMode = localStorage.getItem('streamerMode');
    if (streamMode == '0' || streamMode == '1') {
        if (streamMode == '0') {
            localStorage.setItem('streamerMode', '1');
            document.getElementById('streamerMode').innerHTML = "Streamer Mode is ON";
        }
        if (streamMode == '1') {
            localStorage.setItem('streamerMode', '0');
            document.getElementById('streamerMode').innerHTML = "Streamer Mode is OFF";
        }
    }
}