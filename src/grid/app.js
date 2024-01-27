let toolbar = document.getElementById("toolbar");

const GridPainter = new Painter('drawing-board', 'toolbar', 10);
const limit = 15;

GridPainter.setPaintColor('#000');
GridPainter.setPaintLimit(limit);


toolbar.addEventListener("click", function(event) {
    console.log(event);
    if (event.target.id === 'new-player') {
        // Randon color
        let color = "#" + Math.floor(Math.random()*16777215).toString(16);
        
        GridPainter.setPaintColor(color);
        GridPainter.setPaintLimit(limit);
    }
});

function game_music() {
    myAudio.play();
    if (myAudio.paused == true) {
        myAudio.play();
    }
}
let myAudio = new Audio();

myAudio.src = '../../sound/trilha_initial.mp3';

window.onload = setInterval(game_music, 1000 / 10); //10fps



