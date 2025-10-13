import { CanvasInteractable2D } from "./CanvasInteractable2D";
import { Node } from "./Node";

// Global canvas/sandbox display

export class Canvas {

    constructor(canvas, x_offset, y_offset, prev_x, prev_y, is_dragging, scale_factor) {
        
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");;

        this.mousepos_x = 0;
        this.mousepos_y = 0;
        this.mousepos_world_x = 0;
        this.mousepos_world_y = 0;
        this.x_offset = x_offset;
        this.y_offset = y_offset;
        this.prev_x = prev_x;
        this.prev_y = prev_y; 

        this.is_dragging = is_dragging; 
        this.scale_factor = scale_factor; // Default zoom level
        this.show_toolbar = true;
        this.interactables = []; // List of CanvasInteractables2Ds
        this.nodes = [];
        this.selectedNode = undefined;
        this.boundChangeSelectedNodeName = this.changeSelectedNodeName.bind(this);
        this.boundChangeSelectedNodeColor = this.changeSelectedNodeColor.bind(this);
        this._boundUpdateNodeContent = this.updateNodeContent.bind(this);
        this._boundHandleImageChange = this.handleImageChange.bind(this);
        this.handleCanvasZoom = (e) => {
            e.preventDefault();
            let mouseCanvasPositionXOld = (this.mousepos_x - this.x_offset)/this.scale_factor;
            let mouseCanvasPositionYOld = (this.mousepos_y - this.y_offset)/this.scale_factor;
            if (e.deltaY < 0) {
                this.scale_factor *= 1.04; // Zoom in
            } else {
                this.scale_factor *= 0.96; // Zoom out
            }
            let mouseCanvasPositionXNew = (this.mousepos_x - this.x_offset)/this.scale_factor;
            let mouseCanvasPositionYNew = (this.mousepos_y - this.y_offset)/this.scale_factor;
            this.x_offset += (mouseCanvasPositionXNew - mouseCanvasPositionXOld) * this.scale_factor
            this.y_offset += (mouseCanvasPositionYNew - mouseCanvasPositionYOld) * this.scale_factor
            this.draw();
        }
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
        this.ctx.setTransform(this.scale_factor, 0, 0, this.scale_factor, this.x_offset, this.y_offset);
        this.drawWireframe();

        // Draw all nodes
        for (let node of this.nodes) {
            if (!node.nodraw) node.drawNode();
        }

        this.ctx.restore();

    }

    resizeWindow(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.draw()
    }

    addEventListeners()
    {
        window.addEventListener('resize', this.resizeWindow.bind(this))
        this.canvas.addEventListener("mouseup", () => this.is_dragging = false);
        this.canvas.addEventListener("mouseleave", () => this.is_dragging = false);
        this.canvas.addEventListener("mousedown", (e) => {
            this.is_dragging = true;
            this.prev_x = e.clientX;
            this.prev_y = e.clientY;
        });
        this.canvas.addEventListener("mousemove", (e) => {
            const rect = this.canvas.getBoundingClientRect()
            this.mousepos_x = e.clientX - rect.left;
            this.mousepos_y = e.clientY - rect.top;
            this.mousepos_world_x = (this.mousepos_x - this.x_offset)/this.scale_factor;
            this.mousepos_world_y = (this.mousepos_y - this.y_offset)/this.scale_factor;
            if (!this.is_dragging) 
                return;

            this.x_offset += (e.clientX - this.prev_x)
            this.y_offset += (e.clientY - this.prev_y)

            this.prev_x = e.clientX;
            this.prev_y = e.clientY;

            this.draw();
        });
        this.canvas.addEventListener("wheel", this.handleCanvasZoom);
        for(let interactable of this.interactables) {
            interactable.activateEventListeners();
        }
 
        document.getElementById("nodeColorPicker").removeEventListener("input", this.boundChangeSelectedNodeColor)
        document.getElementById("nodeNameText").removeEventListener("input", this.boundChangeSelectedNodeName)
        document.getElementById("nodeColorPicker").addEventListener("input", this.boundChangeSelectedNodeColor)
        document.getElementById("nodeNameText").addEventListener("input", this.boundChangeSelectedNodeName)
        document.getElementById("node-content-image").addEventListener("change", this._boundHandleImageChange);
    }

    addNode() {
        let newNode = new Node(this, Math.random() * this.canvas.width/10, Math.random() * this.canvas.height/10,25);
        this.nodes.push(newNode);
        this.startForceSim();
    }

    changeSelectedNodeColor(e) {
        if(!this.selectedNode) return
        document.querySelector(".node-content > div").style.backgroundColor = e.currentTarget.value;
        this.selectedNode.setColor(e.currentTarget.value);
    }

    changeSelectedNodeName(e) {
        if(!this.selectedNode) return
        document.getElementById("node-content-title").textContent = e.currentTarget.value;
        this.selectedNode.setTitle(e.currentTarget.value);
    }

    updateNodeContent() {
        if(!this.selectedNode) return;
        this.selectedNode.setContent(document.getElementById("node-content-text").value);
    }

    updateNodeImage() {
        if(!this.selectedNode) return;
        this.selectedNode.setImage(document.getElementById("node-image").src);
    }

    handleImageChange(e) {
        const file = e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                document.getElementById("node-image").src = reader.result;
                document.getElementById("node-image").hidden = false;
                this.updateNodeImage()
            };
            reader.readAsDataURL(file);
        }
    }

    async centerOnNode(node, time = 1.0) {
        if(!node) return;
        time *= 1000;
        let current_time = 0;
        const starting_x_offset = this.x_offset;
        const starting_y_offset = this.y_offset;
        const final_x_offset = (-node.x*this.scale_factor)+(this.canvas.width/2.0)-node.r;
        const final_y_offset = (-node.y*this.scale_factor)+(this.canvas.height/2.0)+node.r;
        const frame_time = 16.666666667;    
        while(current_time <= time) {
            this.x_offset = this.lerp(starting_x_offset, final_x_offset, this.quadraticEaseInOut(current_time/time));
            this.y_offset = this.lerp(starting_y_offset, final_y_offset, this.quadraticEaseInOut(current_time/time));
            //this.x_offset = this.lerp(this.x_offset, final_x_offset, (current_time/time));
            //this.y_offset = this.lerp(this.y_offset, final_y_offset, (current_time/time));
            await this.wait(frame_time);
            current_time += frame_time;
            this.draw()
        }
        this.x_offset = final_x_offset;
        this.y_offset = final_y_offset;
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // NOTE: A single 60FPS frame is 16.67ms long.
    lerp(start, end, t) {
        return start + (end - start) * t;
    }

    quadraticEaseOut(t) {
        return 1 - (1 - t) * (1 - t);
    }

    quadraticEaseInOut(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    startForceSim(maxIter = 10000) {
        if (this.forceSimRunning) return; // prevent multiple loops
        this.forceSimRunning = true;

        let t = 0;

        const step = () => {
            const done = this.forceDirectedStep(t);
            t += 1;
            this.draw();

            if (!done && t < maxIter) {
                requestAnimationFrame(step);
            } else {
                this.forceSimRunning = false;
            }
        };

        requestAnimationFrame(step);
    }

    forceDirectedStep(t, tol = 0.01) {

        let max_iter = 100000;

        const nodes = this.nodes;
        
        if (nodes.length < 2 || t > max_iter) return true;

        // Reset forces
        for (let node of nodes) node.fx = node.fy = 0;

        // Repulsion
        const c_rep = 8000.0;

        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const n1 = nodes[i];
                const n2 = nodes[j];
                const dx = n1.x - n2.x;
                const dy = n1.y - n2.y;
                const dist = Math.sqrt(dx*dx + dy*dy + 0.001);
                const force = (c_rep)/(dist*dist);
                n1.fx += (dx/dist)*force;
                n1.fy += (dy/dist)*force;
                n2.fx -= (dx/dist)*force;
                n2.fy -= (dy/dist)*force;
            }
        }


        // Update positions
        let maxForce = 0;
        for (let node of nodes) {
            maxForce = Math.max(node.fx, node.fy);
            node.x += node.fx * this.cooling(t) || 0;
            node.y += node.fy * this.cooling(t) || 0;

            node.interaction.x += this.cooling(t) * node.fx || 0;
            node.interaction.y += this.cooling(t) * node.fy || 0;
        }

        return maxForce < tol; // done if forces small
    }

    cooling(t, max_iter) {
        return 1;
    }



}