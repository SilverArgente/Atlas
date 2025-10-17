// Um... am I allowed to call the file this..?
import { CanvasInteractable2D } from "./CanvasInteractable2D";

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
        this.nodraw = false;
        this.relatedNodes = {};
    }

    addRelatedNode(nodename) {
        let result = null;
        for(let node of this.canvasObj.nodes) {
            if(node.title === nodename) {
                result = node;
                break;
            }
        }
        if(!result) {
            alert("No node found!"); //DEBUG
            return;
        }
        this.relatedNodes[nodename] = result;
        this.refreshRelatedNodesList();
    }

    removeRelatedNode(nodename) {
        let result = null;
        for(let node of this.canvasObj.nodes) {
            if(node.title === nodename) {
                result = node;
                break;
            }
        }
        if(!result) {
            alert("No node found!"); //DEBUG
            return;
        }
        delete this.relatedNodes[nodename];
        this.refreshRelatedNodesList();
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

    async openInspector() {
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
        document.querySelector(".node-content > div").style.backgroundColor = this.color;
        nodeImage.hidden = !this.image;
        nodeImage.src = this.image;
        document.getElementById("node-content-title").textContent = this.title;
        document.getElementById("node-content-image").value = null;

        this.refreshRelatedNodesList();

        await this.canvasObj.centerOnNode(this, 0.5);
        //this.nodraw = true;
        contentPopup.hidden = false;
        this.canvasObj.draw()
    }

    refreshRelatedNodesList() {
        const relatedNodesList = document.getElementById("relatedNodesList");
        const nodeListDropdown = document.getElementById("relatedNodeSelector");
        nodeListDropdown.innerHTML = "";
        for(let node of this.canvasObj.nodes) {
            if(node === this) continue;
            const newListItem = document.createElement("option");
            newListItem.value = node.title;
            newListItem.textContent = node.title;
            nodeListDropdown.appendChild(newListItem);
        }
        relatedNodesList.innerHTML = "";
        for(let node of Object.values(this.relatedNodes)) {
            const newListItem = document.createElement("li");
            newListItem.textContent = node.title;
            relatedNodesList.appendChild(newListItem);
        }
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