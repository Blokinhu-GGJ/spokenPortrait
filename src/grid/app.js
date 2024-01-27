let toolbar = document.getElementById("toolbar");

const GridPainter = new Painter('drawing-board', 'toolbar', 'paintedCount', 10);
GridPainter.setPaintColor('#000');
GridPainter.setPaintLimit(100);


toolbar.addEventListener("click", function(event) {
    console.log(event);
    if (event.target.id === 'new-player') {
        // Randon color
        let color = "#" + Math.floor(Math.random()*16777215).toString(16);
        
        GridPainter.setPaintColor(color);
        GridPainter.setPaintLimit(100);
    }
});