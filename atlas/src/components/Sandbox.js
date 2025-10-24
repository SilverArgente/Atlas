import React from 'react';
import '../css/Sandbox.css';
import { useRef, useEffect } from 'react';
import { initializeCanvas } from '../scripts/view_sandbox.js';
import NodeContent from './NodeContent.jsx';

export default function Sandbox() {

    const canvas_ref = useRef(null);
    let canvasObject;

    const query = new URLSearchParams(window.location.search);
    const user = query.get("user") || "editor";

    function EditorContents(){
        return(
            <div id="toolbar">
                <h1>Atlas Toolbar</h1>
                <button id="addNodeButton" onClick={()=>{canvasObject.addNode()}}>Add Node</button> <br/>
                <button id="addEdgeButton" onClick={()=>{canvasObject.import()}}>Import</button>
                <button id="addEdgeButton" onClick={()=>{canvasObject.export()}}>Export</button>
                <div id="nodeInspector" hidden>
                    <h3><strong>Node Inspector</strong></h3>
                    <label for="nodeColorPicker">Node Color:</label> <br/>
                    <input type="color" name="nodeColorPicker" id="nodeColorPicker" value="cornflowerblue"></input> <br/>
                    <label for="nodeNameText">Node Name:</label>
                    <input type="text" name="nodeNameText" id="nodeNameText" placeholder='Enter node name...'></input> <br/>
                    
                    <select id="relatedNodeSelector">
                        <option id='default'>Select a Node.</option>
                    </select>
                    <button id="AddRelatedNode">Add</button>
                    <button id="RemoveRelatedNode">Remove</button> <br/>
                    <label for="relatedNodesList">Related Nodes:</label> <br/>
                    <ul id="relatedNodesList">

                    </ul>
                </div>
            </div>
        )
    }

    useEffect(() => {

        const canvas = canvas_ref.current;
        canvasObject = initializeCanvas(canvas, user);

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
            <EditorContents/>
        </div>
    )
}