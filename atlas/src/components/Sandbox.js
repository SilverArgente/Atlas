import React, { useCallback, useState } from 'react';
import '../css/Sandbox.css';
import { useRef, useEffect } from 'react';
import { initializeCanvas } from '../scripts/view_sandbox.js';
import NodeContent from './NodeContent.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Sandbox() {
    const { createPlan, getUserRecord, getPlanID, createRelationship } = useAuth();

    const handleExport = async () => {
        const jsonData = canvasObject.export(true);

        const userRow = await getUserRecord();
        if (!userRow) {
            console.error("Could not fetch user row.");
            return;
        } else {
            console.log("Fetched user id:", userRow.id);
        }

        console.log("Exported JSON:", jsonData.files[0]);
    
        const blob = jsonData.files[0];
        const text = await blob.text();
        const parsed = JSON.parse(text);
    
        const { data, error } = await createPlan(parsed);
    
        if (error) {
            console.error("Error saving plan:", error);
        } else {
            console.log("Plan saved successfully:", data);
        }

        const planID = await getPlanID();
        console.log("Fetched plan ID:", planID.id);

        const { data2, error2 } = await createRelationship(userRow.id, planID.id, true);
        if (error2) {
            console.error("Error saving relationship:", error2);
        } else {
            console.log("Relationship saved successfully:", data2);
        }
    };
    
    
    
    const canvas_ref = useRef(null);
    let [canvasObject, setCanvasObject] = React.useState(null);
    const loadedFile = useCallback(()=>{});
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [layers, setLayers] = useState(["Global"]);
    const [prereqLayers, setPrereqLayers] = useState([]);
    const query = new URLSearchParams(window.location.search);
    const user_type = query.get("user") || "viewer";
    const sharedCallbacks = {
        setPrereqLayers,
        setLayers,
        //setRelatedNodes,
    }
    const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) {
            alert('Error signing out: ' + error.message);
        } else {
            navigate('/');
        }
    };
    useEffect(() => {

        const canvas = canvas_ref.current;
        setCanvasObject(initializeCanvas(canvas, user_type, sharedCallbacks));
    }, [])
    function EditorContents(){
        return(
            <div id="toolbar">
                <h1>Atlas Toolbar</h1>

                <button id="addNodeButton" onClick={()=>{canvasObject.addNode()}}>Add Node</button> <br/>
                <button id="addEdgeButton" onClick={()=>{canvasObject.import()}}>Import</button>
                <button id="addEdgeButton" onClick={handleExport}>Export</button>
                <button id="addEdgeButton" onClick={()=>{canvasObject.export()}}>Save To File</button>
                <button id="refreshSimulationButton" onClick={()=>{canvasObject.restart_simulation()}}>
                    Restart Simulation
                </button>
                {user && (
                    <button
                        id="signOutButton"
                        onClick={handleSignOut}
                        style={{
                            marginTop: '10px',
                            backgroundColor: '#f87171',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Sign Out
                    </button>
                )}
                <div id="nodeInspector" hidden>
                    <h3><strong>Node Inspector</strong></h3>
                    <label htmlFor="nodeColorPicker">Node Color:</label> <br/>
                    <input type="color" name="nodeColorPicker" id="nodeColorPicker" defaultValue="cornflowerblue"></input> <br/>
                    <label htmlFor="nodeNameText">Node Name:</label> <br/>
                    <input type="text" name="nodeNameText" id="nodeNameText" placeholder='Enter node name...'></input> <br/>
                    <label htmlFor="nodeRadiusInput">Node Radius:</label> <br/>
                    <input type="number" name="nodeRadiusInput" id="nodeRadiusInput" min="10" max="100" step="1" defaultValue="25"></input> <br/>
                    <select id="relatedNodeSelector">
                        <option disabled id='default'>Select a Node.</option>
                    </select>
                    <button id="AddRelatedNode">Add</button>
                    <button id="RemoveRelatedNode">Remove</button> <br/>
                    <label htmlFor="relatedNodesList">Related Nodes:</label> <br/>
                    <div style={{border: "solid thin black"}}>
                        <ul id="relatedNodesList">
                            
                        </ul>
                    </div>
                    <br></br>
                    <label for="layerSelector">Layer: </label>
                    <select title="This node's layer" id="layerSelector" onChange={(e)=>{canvasObject.SetLayer(e)}}>
                        {canvasObject ? layers?.map(layer => <option>{layer}</option>) : ""}
                    </select>
                    <br></br>
                    <label for="prereqLayerSelector">Add Prerequisite Layers:</label> <br/>
                    <select title="This node's layer" id="prereqLayerSelector" onChange={(e)=>{
                        const isCyclicPrerequisite = (e.currentTarget.value === document.getElementById("layerSelector").value)
                        document.getElementById("AddPrereqLayer").disabled = isCyclicPrerequisite;
                        document.getElementById("RemovePrereqLayer").disabled = isCyclicPrerequisite;
                    }}>
                        <option disabled selected>Choose a layer.</option>
                        {canvasObject ? layers?.map(layer => <option>{layer}</option>) : ""}
                    </select>
                    <button 
                        id="AddPrereqLayer" 
                        onClick={(e)=>{canvasObject?.addPrereq(); setPrereqLayers(Object.keys(canvasObject?.selectedNode.layer.prereqs))}}>Add</button>
                    <button 
                        id="RemovePrereqLayer" 
                        onClick={()=>{canvasObject?.removePrereq(); setPrereqLayers(Object.keys(canvasObject?.selectedNode.layer.prereqs))}}>Remove</button> <br/>
                    <label title='Layers to be completed before accessing this one.' for="prereqLayerList">Prerequisite Layers:</label> <br/>
                    <div title='Layers to be completed before accessing this one.' style={{border: "solid thin black"}}>
                        <ul id="prereqLayerList">
                            {(canvasObject && prereqLayers.length > 0) ? prereqLayers?.map(layer => <li>{layer}</li>) : <li>None</li>}
                        </ul>
                    </div>
                </div>
                <br></br>
                    <button id="addLayerButton" onClick={()=>{canvasObject?.newLayer(); setLayers(Object.keys(canvasObject?.layers))}}>Add Layer</button> <br></br>
                    <label for="LayerList">Layers: </label>
                    <div title='Layers in this project.' style={{border: "solid thin black"}}>
                        <ul>
                            {(canvasObject && layers.length > 0) ? layers?.map(layer => <li>{layer}</li>) : <li>None</li>}
                        </ul>
                </div>
            </div>
        )
    }

    function ViewerContents(){
        return(
            <div id="toolbar" hidden="true">
                <h1>Atlas Menu</h1>
                {user && (
                    <button
                        id="signOutButton"
                        onClick={handleSignOut}
                        style={{
                            marginTop: '10px',
                            backgroundColor: '#f87171',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        Sign Out
                    </button>
                )}
                <button id="refreshSimulationButton" onClick={()=>{canvasObject.restart_simulation()}}>
                    Restart Simulation
                </button>
            </div>
        )
    }

    function dragImport(){
        return (
            <span id="import-bg">
                <input 
                    id="viewer-file-upload" 
                    type="file" 
                    accept=".json" 
                    onChange={(e)=>{
                        canvasObject.import(e.currentTarget);
                        document.getElementById("import-bg").hidden=true;
                        document.getElementById("toolbar").hidden=false;
                    }}></input>
                <p>Drag in a Concept Map JSON to get started.</p>
            </span>
        )
    }


    const toolbarType = (user_type === "editor") ? EditorContents() : ViewerContents();


    /*useEffect(()=>{
        console.log(canvasObject?.selectedNode.layer.prereqs);
    }, [prereqLayers])*/

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
            {(user_type !== "editor") ? dragImport() : null}
            <NodeContent title="" content=""></NodeContent>
            {toolbarType}
        </div>
    )
}