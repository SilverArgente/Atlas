/*
    contains functions for interactable UI elements.
*/

export class CanvasInteractable2D {
    constructor(canvasObject) {
        this.canvasObject = canvasObject;
        this._listeners = [];
        canvasObject.interactables.append(this);
    }

    addEventListener(event, callback) {
        this._listeners.append({
            event: event,
            callback: callback
        });
    }

    activateEventListeners() {
        for(let listener of this._listeners) {
            this.canvasObject.canvas.addEventListener(listener.event, listener.callback);
        }
    }
}