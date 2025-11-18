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
        this.targets = targets;
        this.nodes = nodes;
        //this.prereqsSatisfied = false;
        //this.complete = false;
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

    addTarget(nodeLayer) {
        this.targets[nodeLayer.name] = nodeLayer;
    }

    removeTarget(nodeLayer) {
        delete this.targets[nodeLayer.name];
    }

    unlock() {
        for(let target in this.targets)
            target.locked = false;
    }

    checkPrereqs() {
        for(let prereq in this.prereqs) {
            if(!prereq.visited) 
                return false;
        }
        return true;
    }

}