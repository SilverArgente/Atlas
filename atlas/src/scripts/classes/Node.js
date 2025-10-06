// Um... am I allowed to call the file this..?
import { CanvasInteractable2D } from "./CanvasInteractable2D";
import NodeContent from "../../components/NodeContent";

export class Node {
    constructor(canvasObj, x, y, r, text="New Node", content="") {
        this.canvasObj = canvasObj;
        this.x = x;
        this.y = y;
        this.r = r;
        this.title = text;
        this.content = content;
        this.color = "cornflowerblue";
        this.interaction = new CanvasInteractable2D(canvasObj, this.x-this.r, this.y-this.r, this.r*2, this.r*2);
        this.interaction.addClickListener(this.openInspector.bind(this));
        this.image = null;
    }

    setTitle(title) {
        this.title = title;
        this.canvasObj.draw();
    }

    setImage(image) {
        this.image = image;
    }

    setContent(content) {
        this.content = content;
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
        document.getElementById("nodeNameText").value = this.title;
        const contentPopup = document.getElementById("node-content-bubble");
        const contentTextArea = document.getElementById("node-content-text")
        if(!contentPopup) return;
        contentTextArea.value = this.content;
        contentTextArea.addEventListener("change", this.canvasObj._boundUpdateNodeContent)
        const nodeImage = document.getElementById("node-image")
        nodeImage.hidden = !this.image;
        nodeImage.src = this.image;
        document.getElementById("node-content-title").textContent = this.title;
        document.getElementById("node-content-image").value = null;
        contentPopup.hidden = false;
    }

    drawNode() {
        const textMargin = 0.25;
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
        ctx.fillText(this.title, this.x - this.r*(1-textMargin), this.y, this.r * (2-textMargin*2));
    }
}