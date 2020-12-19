const fs = require('fs');
const readline = require('readline');
const mapHeight = 800;
const mapWidth = 900;
let i = 0;
let coord = 0;
const dissallowedCoord = [];

// var lineReader = require('readline').createInterface({
//     input: require('fs').createReadStream('test.ppm')
// });

// lineReader.on('line', function (line) {
//     i = i + 1;
//     if ( i > (mapWidth*3)) { i = 0; coord = coord + 1}
//     if (line == 255 && !(i%3)) {
//         console.log((i/3), coord);
//         const coordValue = {left: i, top: coord};
//         dissallowedCoord.push(coordValue);
//     }
// });

async function processLineByLine() {
    const fileStream = fs.createReadStream('test.ppm');
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
  
    for await (const line of rl) {
        i = i + 1;
        if ( i == ((mapWidth)*3) ) { 
            i = 0; 
            coord = coord + 1;
        }
        if (line == 255 && !(i%3)) {
            console.log((i/3), coord);
            const coordValue = {left: (i/3), top: coord};
            dissallowedCoord.push(coordValue);
        }
    }

    var coordJson = JSON.stringify(dissallowedCoord);
    console.log(coordJson);

    fs.writeFile('test.json', coordJson, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
  }

processLineByLine();