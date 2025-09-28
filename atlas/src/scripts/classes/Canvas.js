import { Graph } from './Graph.js';

// Global canvas/sandbox display

export class Canvas {

    constructor(canvas, graph, x_offset, y_offset, prev_x, prev_y, is_dragging, scale_factor) 
    {
        
        this.graph = graph;
        //console.log(graph);

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");;

        this.x_offset = x_offset;
        this.y_offset = y_offset;
        this.prev_x = prev_x;
        this.prev_y = prev_y; 

        this.is_dragging = is_dragging; 
        this.scale_factor = scale_factor; // Default zoom level

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
        // this.initGraph();

        // Example text
        this.ctx.fillStyle = "red";
        this.ctx.font = "24px Arial";
        this.ctx.fillText("Zoom and Pan the canvas!", 150, 150); // This text will also zoom and pan

        this.ctx.restore();

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

    }

    drawToolbar() 
    {
        // ryan pls implement this :D
    }




    // Force directed algorithm to initialize vertex positions in canvas
    initGraph()
    {

        /* 
        const epsilon = 0.001;
        const max_iterations = 1000;

        let t = 0;

        const c_rep = 2.0;
        const c_spring = 1;

        // Intialize forces


        while (t < max_iterations && max_force(F) > epsilon) {
            
            
            t++;
        }
        */
/*
        for (const [vertex, neighbors] in this.graph) {
            console.log(vertex);
        }*/


        for (const [vertex, neighbors] of this.graph.adjacency_list) {
            this.drawNode(vertex);
        }

        // console.log(this.graph);
        // console.log(this.graph instanceof Graph);
        // wconsole.log(this.graph.adjacency_list);

    }


}