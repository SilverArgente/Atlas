import React, { useCallback } from 'react';
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
    const query = new URLSearchParams(window.location.search);
    const user_type = query.get("user") || "viewer";
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
                    <label htmlFor="nodeColorPicker">Node Color:</label> <br/>
                    <input type="color" name="nodeColorPicker" id="nodeColorPicker" defaultValue="cornflowerblue"></input> <br/>
                    <label htmlFor="nodeNameText">Node Name:</label> <br/>
                    <input type="text" name="nodeNameText" id="nodeNameText" placeholder='Enter node name...'></input> <br/>
                    <label htmlFor="nodeRadiusInput">Node Radius:</label> <br/>
                    <input type="number" name="nodeRadiusInput" id="nodeRadiusInput" min="10" max="100" step="1" defaultValue="25"></input> <br/>
                    <select id="relatedNodeSelector">
                        <option id='default'>Select a Node.</option>
                    </select>
                    <button id="AddRelatedNode">Add</button>
                    <button id="RemoveRelatedNode">Remove</button> <br/>
                    <label htmlFor="relatedNodesList">Related Nodes:</label> <br/>
                    <ul id="relatedNodesList">

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