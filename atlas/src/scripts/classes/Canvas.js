import { CanvasInteractable2D } from "./CanvasInteractable2D";

// Global canvas/sandbox display

export class Canvas {

    constructor(canvas, x_offset, y_offset, prev_x, prev_y, is_dragging, scale_factor) {
        
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");;

        this.x_offset = x_offset;
        this.y_offset = y_offset;
        this.prev_x = prev_x;
        this.prev_y = prev_y; 

        this.is_dragging = is_dragging; 
        this.scale_factor = scale_factor; // Default zoom level
        this.show_toolbar = true;
        this.interactables = []; // List of CanvasInteractables2Ds
    }


    drawWireframe() 
    {

        this.ctx.strokeStyle = "#aaa";
        this.ctx.lineWidth = 0.3;
        const gridSize = 50;

        const adjustedGridSize = gridSize / this.scale_factor;

        for (let x = -this.canvas.width; x < this.canvas.width * 2; x += adjustedGridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, -this.canvas.height);
            this.ctx.lineTo(x, this.canvas.height * 2);
            this.ctx.stroke();
        }

        for (let y = -this.canvas.height; y < this.canvas.height * 2; y += adjustedGridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(-this.canvas.width, y);
            this.ctx.lineTo(this.canvas.width * 2, y);
            this.ctx.stroke();
        }

    }


    draw() {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        
        this.ctx.scale(this.scale_factor, this.scale_factor);

        this.ctx.translate(this.x_offset, this.y_offset);

        this.drawWireframe();

        // Example text
        this.ctx.fillStyle = "red";
        this.ctx.font = "24px Arial";
        this.ctx.fillText("Zoom and Pan the canvas!", 150, 150); // This text will also zoom and pan

        this.ctx.restore();

        // stationary elements placed after restore()
        this.drawToolbar();
    }


    addEventListeners()
    {
        
        this.canvas.addEventListener("mouseup", () => this.is_dragging = false);
        this.canvas.addEventListener("mouseleave", () => this.is_dragging = false);
        this.canvas.addEventListener("mousedown", (e) => {
            this.is_dragging = true;
            this.prev_x = e.clientX;
            this.prev_y = e.clientY;
        });
        this.canvas.addEventListener("mousemove", (e) => {
            if (!this.is_dragging) 
                return;

            this.x_offset += (e.clientX - this.prev_x);
            this.y_offset += (e.clientY - this.prev_y);

            this.prev_x = e.clientX;
            this.prev_y = e.clientY;

            this.draw();
        });
        this.canvas.addEventListener("wheel", (e) => {
            e.preventDefault(); 

            if (e.deltaY < 0) {
                this.scale_factor *= 1.05; // Zoom in
            } else {
                this.scale_factor *= 0.96; // Zoom out
            }

            this.draw();
        });
        for(let interactable of this.interactables) {
            interactable.activateEventListeners();
        }
    }

    drawToolbar() 
    {
        // ryan pls implement this :D
        // if you say so big dog ~ryan
        
        // Draw parameters.
        const toolbarMargin = 10;
        const toolbarPadding = 16;
        const toolbarWidth = window.innerWidth * 0.2;
        const toolbarHeight = window.innerHeight - toolbarMargin * 2;
        const toolbarOffsetX = window.innerWidth - toolbarWidth - toolbarMargin;
        const toolbarOffsetY = toolbarMargin; // Redundant obviously, but here for completion sake.
        const titleTextSize = 36;
    
        // Draw background box.
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(toolbarOffsetX, toolbarMargin,toolbarWidth,toolbarHeight);
        this.ctx.strokeRect(toolbarOffsetX, toolbarMargin,toolbarWidth,toolbarHeight);

        // Draw title text.
        //this.ctx.fillStyle = "black";
        //this.ctx.font = `${titleTextSize}px Arial`;
        //this.ctx.fillText("Atlas Toolbar", toolbarOffsetX + toolbarPadding, toolbarOffsetY + toolbarPadding + titleTextSize);

        //Create buttons.

        // As of this moment, Amogh told me to use HTML elements instead.
        // Even though, he told me to work in this function. The Canvas class for drawing Canvas Items.
        // I've commented out the above code, and just left the background of the toolbar.
        // This is why I stick to backend.

        /*const addNodeButton = new CanvasInteractable2D(this);
        const addEdgeButton = new CanvasInteractable2D(this);
        addNodeButton.addEventListener("")*/ // The inciting incident.
    }


}