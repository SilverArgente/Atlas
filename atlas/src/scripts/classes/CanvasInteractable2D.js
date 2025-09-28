/*
    contains functions for interactable UI elements.
*/

export class CanvasInteractable2D {
    constructor(canvasObject, x, y, w, h, name=null) {
        this.canvasObject = canvasObject;
        this._listeners = [];
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
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
        this.addEventListener("click", ()=>{
            console.log(`(${this.canvasObject.mousepos_x}, ${this.canvasObject.mousepos_y})`);
            console.log(`mx: ${this.canvasObject.mousepos_x} bx: ${this.x + this.canvasObject.x_offset}`);
            console.log(`my: ${this.canvasObject.mousepos_y} by: ${this.y + this.canvasObject.y_offset}`);
            if(this.canvasObject.mousepos_x < this.x + this.canvasObject.x_offset || 
                this.canvasObject.mousepos_x > this.x + this.canvasObject.x_offset + this.w || 
                this.canvasObject.mousepos_y < this.y + this.canvasObject.y_offset || 
                this.canvasObject.mousepos_y > this.y + this.canvasObject.y_offset + this.h
            ) {
                return;
            }
            callback();
        })
    }

    activateEventListeners() {
        for(let listener of this._listeners) {
            this.canvasObject.canvas.addEventListener(listener.event, listener.callback);
        }
    }
}