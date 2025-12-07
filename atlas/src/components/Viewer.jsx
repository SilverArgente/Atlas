import { useEffect, useRef, useState } from 'react';
import { initializeCanvas } from '../scripts/view_sandbox';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Viewer() {
  const { updatePlan, createPlan, getUserRecord, createRelationship } = useAuth();
  const [currentPlanID, setCurrentPlanID] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const query = new URLSearchParams(window.location.search);
  const user_type = query.get("user") || "viewer";
  const [layers, setLayers] = useState(["Global"]);
  const [prereqLayers, setPrereqLayers] = useState([]);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const { user, signOut } = useAuth();
  const [canvasObject, setCanvasObject] = useState(null);
  useEffect(()=>{
    if(canvasRef.current) {
      setCanvasObject(initializeCanvas(canvasRef.current));
    }
      
  }, [])

  const handleLiveView = async () => {
        if (!canvasObject) return;
        
        try {
            const jsonData = canvasObject.export(true);
            const blob = jsonData.files[0];
            const text = await blob.text();
            
            const liveViewKey = `liveView_${Date.now()}`;
            sessionStorage.setItem(liveViewKey, text);
            
            const currentUrl = window.location.origin + window.location.pathname;
            const viewerUrl = `${currentUrl}?user=viewer&liveView=${liveViewKey}`;
            window.open(viewerUrl, '_blank');
        } catch (error) {
            console.error('Error opening live view:', error);
            alert('Failed to open live view. Please try again.');
        }
    };

const handleSignOut = async () => {
        const { error } = await signOut();
        if (error) {
            alert('Error signing out: ' + error.message);
        } else {
            navigate('/');
        }
    };

const handleSaveWithName = async (mapName) => {
    const jsonData = canvasObject.export(true, mapName);
    const blob = jsonData.files[0];
    const text = await blob.text();
    const parsed = JSON.parse(text);

    const userRow = await getUserRecord();
    if (!userRow) {
        console.error("Could not fetch user row.");
        return;
    }
    const { data: createdPlan, error } = await createPlan(parsed);
    
    if (error) {
        console.error("Error saving plan:", error);
        return;
    }
    
    console.log("Plan saved successfully:", createdPlan);
    
    const planID = createdPlan.id;
    setCurrentPlanID(planID);

    const { data: relationshipData, error: error2 } = await createRelationship(
        userRow.id, 
        planID, 
        'owner'  
    );
    
    if (error2) {
        console.error("Error saving relationship:", error2);
    } else {
        console.log("Relationship saved successfully:", relationshipData);
    }
    setShowSaveModal(false);
    };
    
    const handleSaveAsUpdate = async () => {
        const jsonData = canvasObject.export(true);
        const blob = jsonData.files[0];
        const text = await blob.text();
        const parsed = JSON.parse(text);

        const userRow = await getUserRecord();
        if (!userRow) {
            console.error("Could not fetch user row.");
            return;
        } else {
            console.log("Fetched user id:", userRow.id);
        }

        console.log("Exported JSON:", jsonData.files[0]);
    
        const { error } = await updatePlan(parsed, currentPlanID);
    
        if (error) {
            console.error("Error saving plan:", error);
        } else {
            console.log("Plan saved successfully");
        }
    }

  const handleSaveButton = () => {
        if (user_type === "viewer") return;
    
        if (!currentPlanID) {
            setShowSaveModal(true);
        } else {
            handleSaveAsUpdate();
        }
    };

    const handleAutoSave = () => {
        if (user_type === "viewer") return;
        if (!canvasObject) return;
    
        // Only auto-save if plan already exists (silent save)
        if (currentPlanID) {
            handleSaveAsUpdate();
        }
        // If no planID, user needs to use "Save Plan" button or modal will show on init
    };

  function EditorContents(){
        return(
            <div id="toolbar">
                <h1 className="toolbar-title">Atlas Toolbar</h1>
                
                <div className="toolbar-section">
                    <h3 className="toolbar-section-title">General</h3>
                    <button id="addEdgeButton" onClick={()=>{canvasObject.import()}} className="toolbar-button">Import</button>
                    {/*<button id="addEdgeButton" onClick={handleExport} className="toolbar-button">Export</button>*/}
                    <button id="addEdgeButton" onClick={()=>{
                        const fileName = prompt('Enter filename:', 'myMap');
                        if(fileName && fileName.trim() !== '') {
                            canvasObject.export(false, fileName.trim());
                        }
                    }} className="toolbar-button">Save To File</button>
                    {user && (
                        <button
                            id="signOutButton"
                            onClick={handleSignOut}
                            className="sign-out-button"
                        >
                            Sign Out
                        </button>
                    )}
                    <button 
                        className="toolbar-button" 
                        onClick={handleSaveButton}
                    >
                        Save Plan
                    </button>
                </div>

                <div className="toolbar-section">
                    <h3 className="toolbar-section-title">Information</h3>
                    <div id="nodeInspector" hidden className="node-inspector">
                        <label htmlFor="nodeColorPicker">Node Color:</label> <br/>
                        <input type="color" name="nodeColorPicker" id="nodeColorPicker" defaultValue="cornflowerblue"></input> <br/>
                        <label htmlFor="nodeNameText">Node Name:</label> <br/>
                        <input type="text" name="nodeNameText" id="nodeNameText" placeholder='Enter node name...'></input> <br/>
                        <label htmlFor="nodeRadiusInput">Node Radius:</label> <br/>
                        <input type="number" name="nodeRadiusInput" id="nodeRadiusInput" min="10" max="100" step="1" defaultValue="25"></input> <br/>
                        <label htmlFor="nodeFontSizeInput">Font Size:</label> <br/>
                        <input type="number" name="nodeFontSizeInput" id="nodeFontSizeInput" min="6" max="128" step="1" defaultValue="12"></input> <br/>
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
                        <br/>
                        <button id="removeNodeButton" onClick={()=>{canvasObject?.removeNode()}} className="toolbar-button-red">Delete Node</button>
                    </div>
                </div>

                <div className="toolbar-section">
                    <h3 className="toolbar-section-title">Graph</h3>
                    <button id="addNodeButton" onClick={()=>{canvasObject.addNode()}} className="toolbar-button">Add Node</button>
                    <button id="refreshSimulationButton" onClick={()=>{canvasObject.restart_simulation()}} className="toolbar-button">
                        Restart Simulation
                    </button>
                    <button id="liveViewButton" onClick={handleLiveView} className="toolbar-button-green">
                        See in Live View
                    </button>
                </div>

                <div>
                    <div className="layers-header">
                        <h3 className="layers-title">Layers</h3>
                        <button id="addLayerButton" onClick={()=>{canvasObject?.newLayer(); setLayers(Object.keys(canvasObject?.layers))}} className="layers-button">Add Layer</button>
                    </div>
                    <ul className="layers-list">
                        {(canvasObject && layers.length > 0) ? layers?.map(layer => <li>{layer}</li>) : <li>None</li>}
                    </ul>
                </div>

                {currentPlanID && (
                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#666' }}>
                        Share Code: {currentPlanID}
                    </div>
                )}
            </div>
        )
    }function EditorContents(){
        return(
            <div id="toolbar">
                <h1 className="toolbar-title">Atlas Toolbar</h1>
                
                <div className="toolbar-section">
                    <h3 className="toolbar-section-title">General</h3>
                    <button id="addEdgeButton" onClick={()=>{canvasObject.import()}} className="toolbar-button">Import</button>
                    <button id="addEdgeButton" onClick={()=>{
                        const fileName = prompt('Enter filename:', 'myMap');
                        if(fileName && fileName.trim() !== '') {
                            canvasObject.export(false, fileName.trim());
                        }
                    }} className="toolbar-button">Save To File</button>
                    {user && (
                        <button
                            id="signOutButton"
                            onClick={handleSignOut}
                            className="sign-out-button"
                        >
                            Sign Out
                        </button>
                    )}
                    <button 
                        className="toolbar-button" 
                        onClick={handleSaveButton}
                    >
                        Save Plan
                    </button>
                </div>

                <div className="toolbar-section">
                    <h3 className="toolbar-section-title">Information</h3>
                    <div id="nodeInspector" hidden className="node-inspector">
                        <label htmlFor="nodeColorPicker">Node Color:</label> <br/>
                        <input type="color" name="nodeColorPicker" id="nodeColorPicker" defaultValue="cornflowerblue"></input> <br/>
                        <label htmlFor="nodeNameText">Node Name:</label> <br/>
                        <input type="text" name="nodeNameText" id="nodeNameText" placeholder='Enter node name...'></input> <br/>
                        <label htmlFor="nodeRadiusInput">Node Radius:</label> <br/>
                        <input type="number" name="nodeRadiusInput" id="nodeRadiusInput" min="10" max="100" step="1" defaultValue="25"></input> <br/>
                        <label htmlFor="nodeFontSizeInput">Font Size:</label> <br/>
                        <input type="number" name="nodeFontSizeInput" id="nodeFontSizeInput" min="6" max="128" step="1" defaultValue="12"></input> <br/>
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
                        <br/>
                        <button id="removeNodeButton" onClick={()=>{canvasObject?.removeNode()}} className="toolbar-button-red">Delete Node</button>
                    </div>
                </div>

                <div className="toolbar-section">
                    <h3 className="toolbar-section-title">Graph</h3>
                    <button id="addNodeButton" onClick={()=>{canvasObject.addNode()}} className="toolbar-button">Add Node</button>
                    <button id="refreshSimulationButton" onClick={()=>{canvasObject.restart_simulation()}} className="toolbar-button">
                        Restart Simulation
                    </button>
                    <button id="liveViewButton" onClick={handleLiveView} className="toolbar-button-green">
                        See in Live View
                    </button>
                </div>

                <div>
                    <div className="layers-header">
                        <h3 className="layers-title">Layers</h3>
                        <button id="addLayerButton" onClick={()=>{canvasObject?.newLayer(); setLayers(Object.keys(canvasObject?.layers))}} className="layers-button">Add Layer</button>
                    </div>
                    <ul className="layers-list">
                        {(canvasObject && layers.length > 0) ? layers?.map(layer => <li>{layer}</li>) : <li>None</li>}
                    </ul>
                </div>

                {currentPlanID && (
                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#666' }}>
                        Share Code: {currentPlanID}
                    </div>
                )}
            </div>
        )
    }

  return (
    <>
      <div ref={canvasRef} style={{width: "100vw", height: "100vh"}}></div>
      <EditorContents/>
    </>
  );
}