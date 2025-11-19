import React, { useCallback, useState } from 'react';
import '../css/Sandbox.css';
import { useRef, useEffect } from 'react';
import { initializeCanvas } from '../scripts/view_sandbox.js';
import NodeContent from './NodeContent.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Sandbox() {

    const canvas_ref = useRef(null);
    let [canvasObject, setCanvasObject] = React.useState(null);
    const loadedFile = useCallback(()=>{});
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [layers, setLayers] = useState(["Global"]);
    const query = new URLSearchParams(window.location.search);
    const user_type = query.get("user") || "viewer";
    const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) {
            alert('Error signing out: ' + error.message);
        } else {
            navigate('/'); // Redirect to homepage after logout
        }
    };
    useEffect(() => {

        const canvas = canvas_ref.current;
        setCanvasObject(initializeCanvas(canvas, user_type));
    }, [])
    function EditorContents(){
        return(
            <div id="toolbar">
                <h1>Atlas Toolbar</h1>

                <button id="addNodeButton" onClick={()=>{canvasObject.addNode()}}>Add Node</button> <br/>
                <button id="addEdgeButton" onClick={()=>{canvasObject.import()}}>Import</button>
                <button id="addEdgeButton" onClick={()=>{canvasObject.export()}}>Export</button>
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
                    <div style={{border: "solid thin black"}}>
                        <ul id="relatedNodesList">

                        </ul>
                    </div>
                    {/*<label title="The layer this node belongs to." for="layerNameText">Layer Name:</label>
                    <input 
                        title="The layer this node belongs to." 
                        type="text" 
                        id="layerNameText" 
                        placeholder='Enter Layer Name' 
                        defaultValue={"Global"}
                        onChange={(e)=>{
                            if(e.currentTarget.value === "") {
                                e.currentTarget.value = "Global"; // field sanitization >>> field validation
                                //document.getElementById("AddPrereqNode").disabled = true;
                                //document.getElementById("RemovePrereqNode").disabled = true;
                            }
                            document.getElementById("AddPrereqNode").value = e.currentTarget.value;
                            document.getElementById("RemovePrereqNode").value = e.currentTarget.value;
                        }}></input>*/}
                    <br></br>
                    <label for="layerSelector">Layer: </label>
                    <select title="This node's layer" id="layerSelector">
                        {canvasObject ? layers?.map(layer => <option>{layer}</option>) : ""}
                    </select>
                    <br></br>
                    <label for="prereqLayerSelector">Prerequisite Layers:</label> <br/>
                    <select title="This node's layer" id="prereqLayerSelector">
                        {canvasObject ? layers?.map(layer => <option>{layer}</option>) : ""}
                    </select>
                    <button id="AddPrereqLayer" onClick={canvasObject?.addPrereq.bind(canvasObject)}>Add</button>
                    <button id="RemovePrereqNode">Remove</button> <br/>
                    <label title='Layers to be completed before accessing this one.' for="prereqLayerList">Prerequisite Layers:</label> <br/>
                    <div title='Layers to be completed before accessing this one.' style={{border: "solid thin black"}}>
                        <ul id="prereqLayerList">

                        </ul>
                    </div>
                </div>
                <br></br>
                    <button id="addLayerButton" onClick={()=>{canvasObject?.newLayer(); setLayers(Object.keys(canvasObject?.layers))}}>Add Layer</button> <br></br>
                    <label for="LayerList">Layers: </label>
                    <div title='Layers in this project.' style={{border: "solid thin black"}}>
                        <ul>
                            {canvasObject ? layers?.map(layer => <li>{layer}</li>) : ""}
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


    useEffect(()=>{

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
            {(user_type !== "editor") ? dragImport() : null}
            <NodeContent title="" content=""></NodeContent>
            {toolbarType}
        </div>
    )
}