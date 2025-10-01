// Um... am I allowed to call the file this..?
import { CanvasInteractable2D } from "./CanvasInteractable2D";

export class Node {
    constructor(canvasObj, x, y, r, text="New Node") {
        this.canvasObj = canvasObj;
        this.x = x;
        this.y = y;
        this.r = r;
        this.text = text;
        this.color = "cornflowerblue";
        this.interaction = new CanvasInteractable2D(canvasObj, this.x-this.r, this.y-this.r, this.r*2, this.r*2);
        this.interaction.addClickListener(this.openInspector.bind(this));
    }

    setTitle(title) {
        this.text = title;
        this.canvasObj.draw();
    }

    setColor(color) {
        this.color = color;
        document.getElementById("nodeColorPicker").value = color;
        this.canvasObj.draw();
    }

    openInspector() {
        this.canvasObj.selectedNode = this;
        document.getElementById("nodeInspector").hidden = false;
        document.getElementById("nodeColorPicker").value = this.color;
        document.getElementById("nodeNameText").value = this.text; 
    }

    drawNode() {
        let ctx = this.canvasObj.ctx;
        let titleTextSize = 12;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r, 0, 2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r, 0, 2*Math.PI);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.font = `${titleTextSize}px Arial`;
        ctx.fillText(this.text, this.x - this.r, this.y, this.r * 2);
    }
}