import { Canvas } from './classes/Canvas.js';
import { Graph } from './classes/Graph.js';

export function initializeCanvas(canvas, parsed_pdf) {

    // Set to fullscreen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let graph = new Graph();

    graph.addNode('node 1');
    graph.addNode('node 2');
    graph.addNode('node 3');

    let Sandbox = new Canvas(canvas, graph, 0, 0, null, null, false, 1);

    Sandbox.addEventListeners();
    Sandbox.draw();

    Sandbox.initGraph();

}
