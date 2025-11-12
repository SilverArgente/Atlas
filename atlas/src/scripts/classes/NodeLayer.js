import { Node } from "./Node";

export class NodeLayer {
    constructor(name, prereqs = {}, targets = {}) {
        this.name = name;
        this.prereqs = prereqs;
        this.targets = targets;
    }

    addPrereq(node) {
        this.prereqs[node.id] = node;
    }

    removePrereq(node) {
        delete this.prereqs[node.id];
    }

    addTarget(node) {
        this.targets[node.id] = node;
    }

    removeTarget(node) {
        delete this.targets[node.id];
    }
}