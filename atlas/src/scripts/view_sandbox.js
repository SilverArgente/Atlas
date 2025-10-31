import { Canvas } from './classes/Canvas.js';

export function initializeCanvas(canvas, parsed_pdf) {

    // Set to fullscreen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let Sandbox = new Canvas(canvas, 0, 0, null, null, false, 1);

    Sandbox.addEventListeners();
    Sandbox.draw();
    // Sandbox.forceDirectedLayout();

    return Sandbox;
}
