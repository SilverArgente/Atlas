import { Node } from "./Node";

export class NodeLayer {

    /* 
        A NodeLayer, denoted by name, must have all "prereqs"
        visited in order to enable the nodes in "targets".

        A NodeLayer, denoted by name, contains a list of nodes that
        pertain to it. "prereqs" NodeLayers must have all nodes visited to enable
        the NodeLayers in "targets"
    */

    constructor(name, nodes = {}, prereqs = {}, targets = {}) {
        this.name = name;
        this.prereqs = prereqs;
        this.nodes = nodes;
    }

    addPrereq(nodeLayer) {
        this.prereqs[nodeLayer.name] = nodeLayer;
    }

    removePrereq(nodeLayer) {
        delete this.prereqs[nodeLayer.name];
    }

    addNode(node) {
        this.nodes[node.id] = node;
    }

    removeNode(nodeID) {
        delete this.nodes[nodeID];
    }

    checkPrereqs() {
        for(let prereqLayer of Object.values(this.prereqs)) {
            for(let prereq of Object.values(prereqLayer.nodes)) {
                if(!prereq.visited) 
                    return false;
            }
        }
        return true;
    }

}