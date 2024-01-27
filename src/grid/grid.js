class Painter {
    constructor (canvasId, toolbarId, gridSize, paintLimit) {
        // HTML ref
        this.canvas = document.getElementById(canvasId);
        this.toolbar = document.getElementById(toolbarId);


        this.ctx = this.canvas.getContext('2d');

        this.canvasOffsetX = this.canvas.offsetLeft;
        this.canvasOffsetY = this.canvas.offsetTop;

        this.gridSize = gridSize;
        this.canvas.width = window.innerWidth - this.canvasOffsetX;
        this.canvas.height = window.innerHeight - this.canvasOffsetY;

        // Variaveis de controle
        this.isPainting = false;
        this.lineWidth = gridSize;
        this.startX = null;
        this.startY = null;

        

        this.toolbar.addEventListener('click', this.handleToolbarClick.bind(this));
        this.toolbar.addEventListener('change', this.handleToolbarChange.bind(this));

        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        this.reset();
        this.setPaintLimit(paintLimit);

        this.drawGrid();

    }

    setPaintLimit(limit) {
        this.paintLimit = limit;
        this.paintedCount = 0;
        this.ctx.clearRect(0, 0, this.canvas.width, 50);
    }

    setPaintColor(color) {
        this.ctx.strokeStyle = color;
    }

    reset() {
        this.paintedCells = new Array(Math.floor(this.canvas.height / this.gridSize)).fill(0).map(() => new Array(Math.floor(this.canvas.width / this.gridSize)).fill(false));
        this.setPaintLimit(this.paintLimit || 100);        
    }

    handleToolbarClick(event) {
        if (event.target.id === 'clear') {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // Clear 
            this.reset();
            this.drawGrid();
            this.setPaintLimit(this.paintLimit);
        }
    }

    handleToolbarChange(event) {
        if(event.target.id === 'stroke') {
            this.ctx.strokeStyle = event.target.value;
        }

        if(event.target.id === 'lineWidth') {
            this.lineWidth = event.target.value;
        }
    }

    handleMouseDown(event) {
        
        this.isPainting = true;
        this.startX = event.clientX;
        this.startY = event.clientY;
    }

    handleMouseUp(event) {
        this.isPainting = false;
        this.ctx.stroke();
        this.ctx.beginPath();
    }

    handleMouseMove(event) {
        this.draw(event);
    }

    draw(event) {
        if(!this.isPainting) {
            return;
        }
        
        if (this.paintedCount < this.paintLimit) {
            const cellX = Math.floor((event.clientX - this.canvasOffsetX) / this.gridSize);
            const cellY = Math.floor(event.clientY / this.gridSize);
            
            if (!this.paintedCells[cellY][cellX]) {
                this.paintedCells[cellY][cellX] = true;
                this.paintedCount++;
                this.drawPaintBar();
            }
        
            this.ctx.fillStyle = this.ctx.strokeStyle;
            this.ctx.fillRect(cellX * this.gridSize, cellY * this.gridSize, this.gridSize, this.gridSize);
        }
    }

    drawGrid = () => {
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 1;
    
        for (let x = 0; x < this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
    
        for (let y = 0; y < this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawPaintBar() {
        const remainingPaintPercentage = (this.paintLimit - this.paintedCount) / this.paintLimit * 100;

        // Clear any previous bar
        this.ctx.clearRect(0, 0, this.canvas.width, 50);

        // Barra
        this.ctx.fillStyle = '#ccc  ';
        this.ctx.fillRect(0, 0, this.canvas.width * (remainingPaintPercentage / 100), 50);

        // Texto
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(`Tinta restante: ${remainingPaintPercentage.toFixed(2)}mL`, 10, 30);
    }
}



