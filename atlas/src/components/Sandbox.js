import React from 'react';
import '../css/Sandbox.css';
import { useRef, useEffect } from 'react';
import { initializeCanvas } from '../scripts/view_sandbox.js';
import NodeContent from './NodeContent.jsx';

export default function Sandbox() {

    const canvas_ref = useRef(null);
    let canvasObject;

    const parsed_pdf = {
        "Quantum Mechanics": {
            description: "Study of physical phenomena at nanoscopic scales",
            children: ["Quantum State", "Electric Field", "Hydrogen Atom"]
        },
        "Quantum State": {
            description: "A mathematical description of a quantum system",
            children: ["Orthogonality", "Different Quantum States", "Wave Function"]
        },
        "Electric Field": {
            description: "A field surrounding charged particles, influencing force",
            children: ["Dipole", "Laser Interactions"]
        },
        "Hydrogen Atom": {
            description: "The simplest atom with one proton and one electron",
            children: ["Different Quantum States", "Laser Interactions"]
        },
        "Orthogonality": {
            description: "Property where two functions are orthogonal in inner product space",
            children: []
        },
        "Different Quantum States": {
            description: "Various possible energy levels of an electron in an atom",
            children: []
        },
        "Wave Function": {
            description: "Mathematical function describing quantum states",
            children: []
        },
        "Dipole": {
            description: "A system of two equal and oppositely charged or magnetized poles",
            children: []
        },
        "Laser Interactions": {
            description: "Interaction of laser fields with atomic or molecular systems",
            children: []
        }
    };

    useEffect(() => {

        const canvas = canvas_ref.current;
        canvasObject = initializeCanvas(canvas, parsed_pdf);

    }, [])

    return (
        <div>
            <canvas 
                id="appCanvas"
                ref={canvas_ref}
                style={{
                    display: "block",
                    width: "100vw",
                    height: "100vh",
                }}
            />
            <NodeContent title="" content=""></NodeContent>
            <div id="toolbar">
                <h1>Atlas Toolbar</h1>
                <button id="addNodeButton" onClick={()=>{canvasObject.addNode()}}>Add Node</button>
                <button id="addEdgeButton" onClick={()=>{alert("Add Edge Clicked!")}}>Add Edge</button>
                <div id="nodeInspector" hidden>
                    <h3><strong>Node Inspector</strong></h3>
                    <label for="nodeColorPicker">Node Color:</label> <br/>
                    <input type="color" name="nodeColorPicker" id="nodeColorPicker" value="cornflowerblue"></input> <br/>
                    <label for="nodeNameText">Node Name:</label>
                    <input type="text" name="nodeNameText" id="nodeNameText" placeholder='Enter node name...'></input> <br/>
                    <label for="relatedNodesList">Related Nodes:</label> <br/>
                    <select id="relatedNodeSelector">

                    </select>
                    <button id="AddRelatedNode">Add</button>
                    <button id="RemoveRelatedNode">Remove</button> <br/>
                    <ul id="relatedNodesList">

                    </ul>
                </div>
            </div>
        </div>
    )
}
