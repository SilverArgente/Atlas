/*
    contains functions for interactable UI elements.
*/

export class CanvasInteractable2D {
    constructor(canvasObject, x, y, w, h, owner) {
        this.canvasObject = canvasObject;
        this._listeners = [];
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.disabled = false;
        this.owner = owner;
        canvasObject.interactables.push(this);
    }

    addEventListener(event, callback) {
        this._listeners.push({
            event: event,
            callback: callback
        });
        this.canvasObject.addEventListeners(); //refresh listeners
    }

    addClickListener(callback) {
        this._clickHandler = ()=>{this.clickCallback(callback)}
        this.addEventListener("click", this._clickHandler)
    }

    clickCallback(callback) {
        if(this.disabled) return;
        if(this.canvasObject.mousepos_world_x < this.x || 
            this.canvasObject.mousepos_world_x > this.x + this.w || 
            this.canvasObject.mousepos_world_y < this.y || 
            this.canvasObject.mousepos_world_y > this.y + this.h
        ) {
            return;
        }
        callback();
    }

    activateEventListeners() {
        for(let listener of this._listeners) {
            this.canvasObject.canvas.addEventListener(listener.event, listener.callback);
        }
    }
}