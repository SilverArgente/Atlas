import { CanvasInteractable2D } from "./CanvasInteractable2D";
import { Node } from "./Node";
import { NodeLayer } from "./NodeLayer";

export class Canvas {

    /*constructor(canvas, x_offset, y_offset, prev_x, prev_y, is_dragging, scale_factor, user_type, sharedCallbacks) {
        
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.sharedCallbacks = sharedCallbacks;

        this.title = "MyMap";

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
        this.nodes = {};
        this.lines = {};
        this.layers = {"Global": new NodeLayer("Global")};
        this.selectedNode = undefined;
        this.user_type = user_type;
        if(user_type === "editor") {
            this.boundChangeSelectedNodeName = this.changeSelectedNodeName.bind(this);
            this.boundChangeSelectedNodeColor = this.changeSelectedNodeColor.bind(this);
            this._boundUpdateNodeContent = this.updateNodeContent.bind(this);
            this._boundHandleImageChange = this.handleImageChange.bind(this);
            this._boundaddRelatedNode = this.addRelatedNode.bind(this);
            this._boundRemoveRelatedNode = this.removeRelatedNode.bind(this);
            this._boundChangeSelectedNodeRadius = this.changeSelectedNodeRadius.bind(this);
            this._boundChangeSelectedNodeFontSize = this.changeSelectedNodeFontSize.bind(this);

        }
        this._boundHandleMouseMove = this.handleMouseMove.bind(this); 
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

        this.loaded_file = undefined;

    }*/

    constructor(canvas) {
        this.canvas = canvas;
    }

    // Returns list of edges.
    getEdges() {
        let edges = [];
        for(let node of Object.values(this.lines)) {
            for(let child of Object.values(node)) {
                edges.push(child);
            }
        }
        return edges;
    }

    // Returns adjacency list.
    getAdjacencyList() {
        let adjList = [];
        let n = 0;
        for(let node of Object.values(this.lines)) {
            adjList.push([]);
            adjList.push([]);
            n += 2;
            for(let child of Object.values(node)) {
                adjList[n-2].push(child.node2);
                adjList[n-1].push(child.node1);
            }
        }
        return adjList;
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
        // Draw all lines
        const disabledLine = "rgba(128,128,128,0.4)";
        for(let node of Object.values(this.lines)) {
            for(let line of Object.values(node)) {
                const gradient = this.ctx.createLinearGradient(line.node1.x, line.node1.y, line.node2.x, line.node2.y);
                gradient.addColorStop(0, (line.node1.disabled) ? disabledLine : line.node1.color);
                gradient.addColorStop(1, (line.node2.disabled) ? disabledLine : line.node2.color);
                this.ctx.beginPath();
                this.ctx.moveTo(line.node1.x, line.node1.y);
                this.ctx.lineTo(line.node2.x, line.node2.y);
                this.ctx.lineWidth = 8;
                this.ctx.strokeStyle = gradient;
                this.ctx.stroke();
            }
        }
        // Draw all nodes
        for (let node of Object.values(this.nodes)) {
            if (!node.nodraw) node.drawNode();
        }
        this.ctx.restore();

    }

    resizeWindow(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.draw()
    }


    handleMouseMove(e) {
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
        this.canvas.addEventListener("mousemove", this._boundHandleMouseMove);
        this.canvas.addEventListener("wheel", this.handleCanvasZoom);
        for(let interactable of this.interactables) {
            interactable.activateEventListeners();
        }
    

        
        if(this.user_type === "editor") {
            document.getElementById("popup-bg").addEventListener("click", ()=>{
                document.getElementById("nodeInspector").hidden = true;
            });
            document.getElementById("nodeColorPicker").removeEventListener("input", this.boundChangeSelectedNodeColor)
            document.getElementById("nodeNameText").removeEventListener("input", this.boundChangeSelectedNodeName)
            
            const nodeRadiusInput = document.getElementById("nodeRadiusInput");
            if(nodeRadiusInput) {
                nodeRadiusInput.removeEventListener("input", this._boundChangeSelectedNodeRadius);
            }
            
            document.getElementById("nodeColorPicker").addEventListener("input", this.boundChangeSelectedNodeColor)
            document.getElementById("nodeNameText").addEventListener("input", this.boundChangeSelectedNodeName)
            
            if(nodeRadiusInput) {
                nodeRadiusInput.addEventListener("input", this._boundChangeSelectedNodeRadius);
            }

            document.getElementById("nodeFontSizeInput").removeEventListener("input", this._boundChangeSelectedNodeFontSize);
            document.getElementById("nodeFontSizeInput").addEventListener("input", this._boundChangeSelectedNodeFontSize);
            
            document.getElementById("node-content-image").addEventListener("change", this._boundHandleImageChange);
            document.getElementById("node-content-title").addEventListener("click", ()=>{document.getElementById("nodeNameText").focus()})
            document.getElementById("relatedNodeSelector").addEventListener("change", ((e)=>{
                const selectedOption = e.currentTarget.options[e.currentTarget.selectedIndex];
                document.getElementById("AddRelatedNode").disabled = (selectedOption.id == 'default');
                document.getElementById("RemoveRelatedNode").disabled = (selectedOption.id == 'default' || (this.selectedNode && !this.selectedNode.relatedNodes[selectedOption.value]));
            }).bind(this));
            document.getElementById("AddRelatedNode").removeEventListener("click", this._boundaddRelatedNode);
            document.getElementById("RemoveRelatedNode").removeEventListener("click", this._boundRemoveRelatedNode);
            document.getElementById("AddRelatedNode").addEventListener("click", this._boundaddRelatedNode);
            document.getElementById("RemoveRelatedNode").addEventListener("click", this._boundRemoveRelatedNode);
        }
    }

    addRelatedNode(nodeTarget = this.selectedNode, relatedId = null) {
        if(nodeTarget instanceof Event) nodeTarget = this.selectedNode;
        if(!nodeTarget) return;
        let relatedNodeId = (relatedId) ? relatedId : document.getElementById("relatedNodeSelector").value;
        if(!this.lines[nodeTarget.id]) {
            this.lines[nodeTarget.id] = {};
        }
        this.lines[nodeTarget.id][relatedNodeId] = {
            node1: nodeTarget,
            node2: this.nodes[relatedNodeId]
        };
        nodeTarget.addRelatedNode(relatedNodeId);
        this.draw()
    }

    removeRelatedNode() {
        if(!this.selectedNode) return;
        let relatedNodeId = document.getElementById("relatedNodeSelector").value;
        if(this.lines[this.selectedNode.id])
            delete this.lines[this.selectedNode.id][relatedNodeId];
        this.selectedNode.removeRelatedNode(relatedNodeId);
        this.draw()
    }

    addNode() {
        /*let name = `New Node${(this.nodes["New Node"]) ? ` (${Object.values(this.nodes).length})` : ""}`;
        let newNode = new Node(this, Math.random() * this.canvas.width/10, Math.random() * this.canvas.height/10,25, name);
        this.nodes[name] = newNode;
        this.startForceSim();
        return newNode;*/
        let name = `New Node${(this.canvas.filter('[id = "New Node"]')) ? ` (${Object.values(this.canvas.nodes()).length})` : ""}`;
        this.canvas.add({
            group: 'nodes',
            data: {id: name},
            position: {x: Math.random() * this.canvas.width()/2, y: Math.random() * this.canvas.height()/2 },
            style: {
                'width': 50,
                'height': 50,
                "background-color": "cornflowerblue",
                'text-valign': 'center'
            }
            
        });
        let nodeId = `[id = "${name}"]`;
        let newNode = this.canvas.filter(nodeId);
        newNode.atlasNodeMetadata = {
            title: name,
            content: "",
            //color: "cornflowerblue",
            image: null,
            relatedNodes: {}
        }
        this.canvas.on('drag', nodeId, ()=>{
            this.startForceSim();
        });
        this.canvas.on('tap', nodeId, ()=>{this.OpenInspector(newNode)});
        this.startForceSim();
        return newNode;
    }

    async OpenInspector(node) {
        const contentPopup = document.getElementById("node-content-bubble");
        const contentTextArea = document.getElementById("node-content-text");

        document.getElementById("nodeInspector").hidden = false;
        document.getElementById("nodeColorPicker").value = node.style('background-color');
        document.getElementById("nodeNameText").value = node.atlasNodeMetadata.title;

        await this.centerOnNode(node, 0.5);
        contentPopup.hidden = false;
    }

    removeNode() {
        if(!this.selectedNode) return;

        //Find and destroy related node references
        for(let node of Object.values(this.nodes)) {
            node.removeRelatedNode(this.selectedNode.id);
        }
        this.layers[this.selectedNode.layer.name].removeNode(this.selectedNode.id);
        document.getElementById("node-content-bubble").hidden = true;
        document.getElementById("nodeInspector").hidden = true;
        this.selectedNode.cleanup();
        delete this.nodes[this.selectedNode.id];
        this.restart_simulation();
    }

    changeSelectedNodeColor(e) {
        if(!this.selectedNode) return
        document.querySelector(".node-content > div").style.backgroundColor = e.currentTarget.value;
        this.selectedNode.setColor(e.currentTarget.value);
    }

    changeSelectedNodeName(e) {
        if(!this.selectedNode) return
        // disabled, as now you can name nodes the same thing.
        if(false && this.nodes[e.currentTarget.value]) {
            e.currentTarget.style.borderColor = 'red';
            e.currentTarget.style.borderWidth = 'medium';
            return;
        } else {
            e.currentTarget.style.borderWidth = '';
            e.currentTarget.style.borderColor = '';
        }
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

    changeSelectedNodeRadius(e) {
        if(!this.selectedNode) return;
        const newRadius = parseFloat(e.currentTarget.value);
        if(newRadius > 0) {
            this.selectedNode.setRadius(newRadius);
        }
    }

    changeSelectedNodeFontSize(e) {
        if(!this.selectedNode) return;
        const newSize = parseInt(e.currentTarget.value);
        if(newSize > 0) {
            this.selectedNode.setFontSize(newSize);
        }
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
        this.canvas.animate({
            center: {eles: node},
            easing: "ease-in-out-quad",
            duration: time * 1000
        })
        await this.wait(time * 1000);
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    startForceSim(maxIter = 10000) {
        if (this.forceSimRunning) return; // prevent multiple loops
        this.forceSimRunning = true;

        let t = 0;

        const step = () => {
            const done = this.forceDirectedStep(t);
            t += 1;
            //this.draw();

            if (!done && t < maxIter) {
                requestAnimationFrame(step);
            } else {
                this.forceSimRunning = false;
            }
        };

        requestAnimationFrame(step);
    }

    cooling(t, max_iter = 10000) {
        return Math.max(0.01, 1.0 - (t / max_iter));
    }

    forceDirectedStep(t, tol = 0.01) {
        //const nodes = Object.values(this.nodes);
        const nodes = this.canvas.nodes();
        if (nodes.length < 2) return true;

        // Initialize velocities if they don't exist
        for (let node of nodes) {
            if (node.vx === undefined) node.vx = 0;
            if (node.vy === undefined) node.vy = 0;
            node.fx = node.fy = 0;
        }

        // Repulsion
        const c_rep = 8000.0;
        const maxRepulsionDist = 300; // Ideal distance
        const minForce = 0.001;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const n1 = nodes[i];
                const n2 = nodes[j];
                const dx = n1.position('x') - n2.position('x');
                const dy = n1.position('y') - n2.position('y');
                const dist = Math.sqrt(dx * dx + dy * dy + 0.001);
                
                if (dist > maxRepulsionDist) continue;
                
                const force = c_rep / (dist * dist);
                if (force < minForce) continue;
                
                n1.fx += (dx / dist) * force;
                n1.fy += (dy / dist) * force;
                n2.fx -= (dx / dist) * force;
                n2.fy -= (dy / dist) * force;
            }
        }

        // Attraction
        const c_attr = 0.01;
        for (let nodeId in this.lines) {
            //const connections = this.lines[nodeId];
            const connections = this.canvas.edges();
            for (let relatedId in connections) {
                const { node1, node2 } = connections[relatedId];
                const dx = node2.position('x') - node1.position('x');
                const dy = node2.position('y') - node1.position('y');
                const dist = Math.sqrt(dx * dx + dy * dy + 0.001);

                const idealLength = 200;
                const force = c_attr * (dist - idealLength);

                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                node1.fx += fx;
                node1.fy += fy;
                node2.fx -= fx;
                node2.fy -= fy;

            }
        }

        // Apply forces
        let maxForce = 0;
        const coolingFactor = this.cooling(t, 10000);
        const damping = 0.85; // Velocity damping to prevent drift
        const velocityThreshold = 0.001;
        
        for (let node of nodes) {
            // Update velocity with damping
            node.vx = (node.vx + node.fx * coolingFactor) * damping;
            node.vy = (node.vy + node.fy * coolingFactor) * damping;
            
            if (Math.abs(node.vx) < velocityThreshold) node.vx = 0;
            if (Math.abs(node.vy) < velocityThreshold) node.vy = 0;
            
            if (!node.grabbed() && (node.vx !== 0 || node.vy !== 0)) {
                node.position({x: (node.position('x') + node.vx), y: (node.position('y') + node.vy)})
            }
            
            maxForce = Math.max(maxForce, Math.abs(node.fx), Math.abs(node.fy));
        }

        return maxForce < tol;
    }

    PrerequisiteValidation() {
        for(let layer of Object.values(this.layers)) {
            if(layer.prereqs && Object.keys(layer.prereqs).length == 0) return;
        }
        alert("Warning: Your map has no root nodes without prerequisites. Viewers will not be able to view any of the nodes. Make sure that root nodes have no prerequisites to avoid this.");
    }

    addPrereq() {
        if(!this.selectedNode) return;
        const layer = this.selectedNode.layer.name;
        const prereqLayer = document.getElementById("prereqLayerSelector").value;
        if(!this.layers[layer])
            this.layers[layer] = new NodeLayer(layer);
        this.layers[layer].addPrereq(this.layers[prereqLayer]);
        //this.layers[prereqLayer].addTarget(this.layers[layer]);
        console.log(`Added prereq ${prereqLayer} to ${layer}`);
        this.PrerequisiteValidation();
    }

    removePrereq() {
        if(!this.selectedNode) return;
        const layer = this.selectedNode.layer.name;
        const prereqLayer = document.getElementById("prereqLayerSelector").value;
        if(!this.layers[layer]) return;
        this.layers[layer].removePrereq(this.layers[prereqLayer]);
        console.log(`Removed prereq ${prereqLayer} to ${layer}`);
    }

    SetLayer(e) {
        if(!this.selectedNode) return;
        this.selectedNode.layer.removeNode(this.selectedNode.id);
        this.selectedNode.layer = this.layers[e.currentTarget.value];
        this.selectedNode.layer.addNode(this.selectedNode);
        this.sharedCallbacks.setPrereqLayers(Object.keys(this.selectedNode.layer.prereqs));
    }

    newLayer(){
        const name = prompt("Enter layer name:")
        if(!name) return;
        this.layers[name] = new NodeLayer(name);
        console.log(`Created node layer ${this.layers[name]}`);
    }

    export(localExport = false, fileName = undefined) {
        if(fileName)
            this.title = fileName;
        let saveData = {
            title: this.title,
            nodes: [],
            edges: [],
            layers: []
        };
        for(let node of Object.values(this.nodes)) {
            saveData.nodes.push({
                x: node.x,
                y: node.y,
                r: node.r,
                title: node.title,
                id: node.id,
                content: node.content,
                color: node.color,
                image: node.image,
                fontSize: node.fontSize,
                relatedNodes: Object.keys(node.relatedNodes)
            });
        }

        let edges = this.getEdges();
        for(let edge of edges) {
            saveData.edges.push({node1: edge.node1.id, node2: edge.node2.id});
        }

        for(let layer of Object.values(this.layers)) {
            saveData.layers.push({
                nodes: Object.keys(layer.nodes),
                prereqs: Object.keys(layer.prereqs),
                name: layer.name
            });
        }

        let jsonData = JSON.stringify(saveData, null);
        for(let node of Object.values(this.nodes)) {
           node.canvasObj = this;
        }
        const blob = new Blob([jsonData], { type: 'application/json' });
        if(localExport) return {files: [blob]};
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.json`;
        a.click();
    }

    restart_simulation() {
        if(!this.canvas) return;
        this.import(this.export(true));
        this.draw();
    }

    async import(input = undefined) {
        if(!input) {
            input = document.createElement('input');
            input.type = "file";
            input.accept = ".json";
            input.click();
            await new Promise(resolve => {input.addEventListener("change", resolve, {once: true})});
        }
        console.log(input);
        this.loaded_file = input;
        // Cleanup Everything (leave it to the garbage collector) (11/11/25 note: DOES HE KNOW?)
        for(let node of Object.values(this.nodes)) {
            node.cleanup();
        }
        this.nodes = {};
        this.lines = {};
        this.layers = {"Global": new NodeLayer("Global")};
        this.interactables = [];
        const selectedFile = input.files[0];
        if(!selectedFile) {
            console.error("FAILED TO IMPORT FILE!");
            return;
        }
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e)=>{
                const content = e.target.result;
                try {
                    const data = JSON.parse(content);
                    this.title = data.title;
                    // Fill nodes
                    for(let node of data.nodes) {
                        let newNode = this.addNode();
                        newNode.setTitle(node.title);
                        newNode.setColor(node.color);
                        newNode.setImage(node.image);
                        newNode.setContent(node.content);
                        newNode.id = node.id;
                        newNode.fontSize = node.fontSize;
                        newNode.r = node.r;
                    }

                    // Layers
                    for(let layer of data.layers) {
                        if(!this.layers[layer.name])
                            this.layers[layer.name] = new NodeLayer(layer.name);
                        for(let nodeName of layer.nodes) {
                            if(!this.nodes[nodeName]) continue; //Skip bugged entries.
                            this.nodes[nodeName].layer.removeNode(nodeName);
                            this.layers[layer.name].addNode(this.nodes[nodeName]);
                            this.nodes[nodeName].layer = this.layers[layer.name];
                        }
                        for(let prereqName of layer.prereqs) {
                            if(!this.layers[prereqName])
                                this.layers[prereqName] = new NodeLayer(prereqName);
                            this.layers[layer.name].addPrereq(this.layers[prereqName]);
                        }
                    }
                    this.sharedCallbacks.setLayers(Object.keys(this.layers));

                    // Set related node lists
                    for(let node of data.nodes) {
                        for(let relatedNodeId of node.relatedNodes) {
                            this.addRelatedNode(this.nodes[node.id], relatedNodeId);
                        }
                    }
                    resolve();
                } catch(e) {
                    console.error("FAILED TO IMPORT FILE!", e);
                    alert("Failed to load Concept Map. Data may be malformed or corrupt.");
                    reject(e);
                }
            }
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsText(selectedFile);
        });
    }
}