import { Node } from './Node.js';

// Graph as adjacency list, to represent concept map

export class Graph {

    constructor() 
    {

        this.n = 0;
        this.adjacency_list = new Map();

    }

    addNode(name)
    {

        let node = new Node(name, 0, 0, 100);

        if (!this.adjacency_list.has(node.name)) {
            this.adjacency_list.set(node.name, []);
        }

        this.n++;

    }

    addEdge(v1_name, v2_name)
    {

        if (this.adjacency_list.has(v1_name) && this.adjacency_list.has(v2_name)) {
            this.adjacency_list.get(v1_name).push(v2_name);
            this.adjacency_list.get(v2_name).push(v1_name);
        }
        else {
            console.log("One or more vertex names do not exist.")
        }

    }

}