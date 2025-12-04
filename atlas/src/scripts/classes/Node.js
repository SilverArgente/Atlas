// Um... am I allowed to call the file this..?
import { CanvasInteractable2D } from "./CanvasInteractable2D";

export class Node {
    constructor(canvasObj, x, y, r, text="New Node", content="") {
        this.canvasObj = canvasObj;
        this.x = x;
        this.y = y;
        this.r = r;
        //this.id = Object.keys(canvasObj.nodes)[Object.keys(canvasObj.nodes).length-1]+1;
        this.title = text;
        this.id = text; // Not really an ID. but just its initial name, which... might be unique... TODO: replace with proper ID system.
        this.content = content;
        this.color = "cornflowerblue";
        this.interaction = new CanvasInteractable2D(canvasObj, this.x-this.r, this.y-this.r, this.r*2, this.r*2, this);
        this.interaction.addClickListener(this.openInspector.bind(this));
        this.image = null;
        this.nodraw = false;
        this.visited = false;
        this.locked = false;
        this.fontSize = 12;
        this.relatedNodes = {};
        this.layer = canvasObj.layers["Global"];
        this.layer.addNode(this);
    }

    setRadius(r) {
        this.r = r;
        this.interaction.x = this.x - this.r;
        this.interaction.y = this.y - this.r;
        this.interaction.w = this.r * 2;
        this.interaction.h = this.r * 2;
        this.canvasObj.draw();
    }

    addRelatedNode(nodename) {
        let result = null;
        for(let node of Object.values(this.canvasObj.nodes)) {
            if(node.id === nodename) {
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

    cleanup() {
        // my god.
        this.interaction.disabled=true;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.interaction.x = x-this.r;
        this.interaction.y = y-this.r;
        this.canvasObj.draw();
    }

    removeRelatedNode(nodename) {
        let result = null;
        for(let node of Object.values(this.canvasObj.nodes)) {
            if(node.id === nodename) {
                result = node;
                break;
            }
        }
        if(!result) {
            //alert("No node found!"); //DEBUG
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
        if(this.canvasObj.user_type === "editor")
            document.getElementById("nodeColorPicker").value = color;
        this.canvasObj.draw();
    }

    async openInspector() {
        if(this.disabled) {
            alert("This node is disabled, the prerequisite nodes must be visited first!");
            return;
        }
        this.visited = true;
        this.canvasObj.selectedNode = this;
        const contentPopup = document.getElementById("node-content-bubble");
        const contentTextArea = document.getElementById("node-content-text");
        if(!contentPopup) return;
        if(this.canvasObj.user_type === "editor") {
            document.getElementById("nodeInspector").hidden = false;
            document.getElementById("nodeColorPicker").value = this.color;
            document.getElementById("nodeNameText").value = this.title;
            
            const nodeRadiusInput = document.getElementById("nodeRadiusInput");
            if(nodeRadiusInput) {
                nodeRadiusInput.value = this.r;
            }
            document.getElementById("nodeFontSizeInput").value = (this.fontSize) ? this.fontSize : 12;
            
            document.getElementById("node-content-image").value = null;
            contentTextArea.addEventListener("change", this.canvasObj._boundUpdateNodeContent)

            const layerSelector = document.getElementById("layerSelector");
            layerSelector.options[layerSelector.selectedIndex].selected = false;
            for(let layerOption of layerSelector.options) {
                if(layerOption.value === this.layer.name) {
                    layerOption.selected = true;
                    break;
                }
            }
            document.getElementById("prereqLayerSelector").selectedIndex = 0;

            this.canvasObj.sharedCallbacks.setPrereqLayers(Object.keys(this.layer.prereqs))
            //this.refreshPrerequisiteNodesList(); // May need to be moved out of here.

        } else {
            contentTextArea.readOnly = true;
            contentTextArea.placeholder = "No content..."
            document.getElementById("node-content-image").hidden = true;
            document.getElementById("node-content-image-label").hidden = true;
            document.getElementById("node-content-header").firstChild.textContent = "";
        }
        this.refreshRelatedNodesList();
        contentTextArea.value = this.content;
        const nodeImage = document.getElementById("node-image")
        document.querySelector(".node-content > div").style.backgroundColor = this.color;
        nodeImage.hidden = !this.image;
        nodeImage.src = this.image;
        document.getElementById("node-content-title").textContent = this.title;

        await this.canvasObj.centerOnNode(this, 0.5);
        //this.nodraw = true;
        contentPopup.hidden = false;
        this.canvasObj.draw()
    }

    refreshPrerequisiteNodesList() {
        const list = document.getElementById("prereqLayerList");
        list.innerHTML = "";
        for(let prereq in Object.values(this.layer.prereqs)) {
            const newListItem = document.createElement("li");
            newListItem.textContent = prereq.name;
            list.appendChild(newListItem);
        }
    }

    refreshRelatedNodesList() {
        const relatedNodesList = document.getElementById("relatedNodesList");
        const nodeListDropdown = document.getElementById("relatedNodeSelector");
        const buttonList = document.getElementById("RelatedNodeButtons");
        // if (!buttonList) return;
        if(this.canvasObj.user_type === "editor") {
            nodeListDropdown.innerHTML = "<option disabled id='default'>Select a Node.</option>"; // Future note (11/19/2025), this was dumb
            document.getElementById("AddRelatedNode").disabled = true;
            document.getElementById("RemoveRelatedNode").disabled = true;
            for(let node of Object.values(this.canvasObj.nodes)) {
                if(node === this) continue;
                const newListItem = document.createElement("option");
                newListItem.value = node.id;
                newListItem.textContent = node.title;
                nodeListDropdown.appendChild(newListItem);
            }
            relatedNodesList.innerHTML = "";
            nodeListDropdown.selectedIndex = 0;
        }
        buttonList.innerHTML = "";
        if(Object.values(this.relatedNodes).length == 0) {
            const newParagraph = document.createElement("p");
            newParagraph.textContent = "None";
            buttonList.appendChild(newParagraph);
            return;
        }
        for(let node of Object.values(this.relatedNodes)) {
            const newListItem = document.createElement("li");
            const newRelatedButton = document.createElement("button");
            newRelatedButton.classList.add("RelatedNodebutton");
            newRelatedButton.value = node.title;
            newRelatedButton.textContent = node.title;
            newRelatedButton.addEventListener("click", node.openInspector.bind(node))
            newListItem.textContent = node.title;
            buttonList.appendChild(newRelatedButton);
            if(this.canvasObj.user_type === "editor")
                relatedNodesList.appendChild(newListItem);
        }
    }

    // Why is there a second identical setRadius() here LOL? 
    setRadius(r) 
    {
        this.r = r;

        this.interaction.x = this.x - this.r;
        this.interaction.y = this.y - this.r;
        this.interaction.w = this.r * 2;
        this.interaction.h = this.r * 2;
        this.canvasObj.draw();
    }

    setFontSize(size) 
    {
        this.fontSize = size;
        this.canvasObj.draw();
    }

    drawNode() 
    {
        this.disabled = this.canvasObj.user_type === "viewer" && !this.layer.checkPrereqs(); // This should not be done on Draw, it should be done when the node states have changed. (how to detect that, i dont know yet.)
        const textMargin = 0.25;
        const disabledColor = "rgba(128,128,128,0.4)";
        let ctx = this.canvasObj.ctx;
        let titleTextSize = this.fontSize ? this.fontSize : 12;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2*Math.PI);
        ctx.fillStyle = (this.disabled) ? disabledColor : this.color;
        ctx.fill();
        ctx.fillStyle = (this.disabled) ? "gray" : "black";
        ctx.font = `${titleTextSize}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.title, this.x, this.y);
    }

}