import { Canvas } from './classes/Canvas.js';
import cytoscape from "cytoscape";

export function initializeCanvas(canvas /*user_type, sharedCallbacks*/) {

    // Set to fullscreen
    //canvas.width = window.innerWidth;
    //canvas.height = window.innerHeight;

    
    let cy = cytoscape({
        container: canvas,
        elements: [],

        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                'background-color': '#666',
                'width': 25,
                'height': 25,
                'label': 'data(id)'
                }
            },

            {
                selector: 'edge',
                style: {
                'width': 3,
                'line-color': '#ccc',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier'
                }
            }
        ],

    layout: {
    name: 'grid',
    rows: 1
    }

    });

    let Sandbox = new Canvas(cy);

    return Sandbox;
}
