import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate();
  const { createPlan, getUserRecord, user, getUserPlans, deletePlan, createRelationship } = useAuth();  
  const [myMaps, setMyMaps] = useState([]);
  const [sharedMaps, setSharedMaps] = useState([]);
  const [mapCode, setMapCode] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch plans on mount
useEffect(() => {
  const fetchPlans = async () => {
    const { data, error } = await getUserPlans();
    if (error) {
      console.error('Error fetching plans:', error);
      return;
    }
    
    console.log('Fetched plans:', data); // Debug
    
    // Remove duplicates by plan ID
    const uniquePlans = data.reduce((acc, plan) => {
      if (!acc.find(p => p.id === plan.id)) {
        acc.push(plan);
      }
      return acc;
    }, []);
    
    // Separate owned vs shared
    const owned = uniquePlans.filter(p => p.relationship === 'owner');
    const shared = uniquePlans.filter(p => p.relationship !== 'owner');
    
    setMyMaps(owned);
    setSharedMaps(shared);
  };
  
  if (user) {
    fetchPlans();
  }
}, [user, refreshKey]);

  const handleCreateNew = () => {
    navigate('/create?user=editor');
  };

  const handleImport = async () => {
    try {
      if (!mapCode.trim()) {
        alert("Please enter a map code.");
        return;
      }
  
      const userRecord = await getUserRecord();
      if (!userRecord) {
        alert("You must be logged in to import a map.");
        return;
      }
  
      const userId = userRecord.id;
      const planId = parseInt(mapCode);
  
      const { data, error } = await createRelationship(userId, planId, "viewer");
  
      if (error) {
        alert(error.message || "Error importing map.");
        return;
      }
  
      alert("Successfully imported plan!");
      setRefreshKey(prev => prev + 1);
  
    } catch (err) {
      alert("Unexpected error: " + (err.message || err));
    }
  };
    
  


const handleDelete = async (planId, isShared = false) => {
  const { error } = await deletePlan(planId);
  if (!error) {
    if (isShared) {
      setSharedMaps(prev => prev.filter(m => m.id !== planId));
    } else {
      setMyMaps(prev => prev.filter(m => m.id !== planId));
    }
  }
};

  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
  e.preventDefault();
  e.stopPropagation();
  };

  const handleDragExit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleFileDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const jsonFile = files.find(f => f.name.endsWith('.json'));
    
    if (!jsonFile) {
      alert('Please drop a .json file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async() => {
      try {
        const conceptMapData = JSON.parse(reader.result);
        
        // Validate the structure
        if (!conceptMapData.nodes || !Array.isArray(conceptMapData.nodes)){
          alert ('Invalid concept map format: missing nodes array');
          return;
        }
        if (!conceptMapData.edges){
          alert ('Invalid concept map format: missing edges array');
          return;
        }
        
        // Ensure all required fields exist with defaults
        const normalizedData = {
          title: conceptMapData.title || jsonFile.name.replace('.json', ''),
          nodes: conceptMapData.nodes.map(node => ({
            id: node.id,
            title: node.title || 'Untitled',
            color: node.color || '#3b82f6',
            image: node.image || '',
            content: node.content || '',
            fontSize: node.fontSize || 16,
            r: node.r || 50,
            relatedNodes: node.relatedNodes || [],
            layer: node.layer || 'Global'
          })),
          edges: conceptMapData.edges || [],
          layers: conceptMapData.layers || [{ name: 'Global', nodes: conceptMapData.nodes.map(n => n.id), prereqs: [] }]
        };


        //Save to database
        const userRow = await getUserRecord();
        if (!userRow){
          alert('User record not found');
          return;
        }

        const { data: savedPlan, error } = await createPlan(conceptMapData);
        if( error ) {
          alert('Failed to save concept map');
          return;
        }

        //Create relationship to user
        const { error: relError } = await createRelationship(
          userRow.id,
          savedPlan.id,
          'viewer'
        );

        if (relError) {
          console.error('Error creating relationship:', relError);
        }

        //Add to the displayed list
        const newMap = {
          id: savedPlan.id,
          title: jsonFile.name.replace('.json', ''),
          createdAt: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          lastModified: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          owner: 'shared',
          relationship: 'viewer'
        };
      
        setSharedMaps([...sharedMaps, newMap]);

        alert(`Imported: ${jsonFile.name}`);
      } catch (err) {
        alert('Invalid concept map file');
      }
    };
    reader.readAsText(jsonFile);
  };

const MapCard = ({ map, canDelete, isShared = false }) => (
  <div className={`border rounded-lg p-4 transition ${
    isShared 
      ? 'bg-indigo-950/20 border-indigo-800/50 hover:border-indigo-700' 
      : 'bg-gray-900 border-gray-700 hover:border-gray-500'
  }`}>
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-lg font-semibold">{map.title}</h3>
      {isShared && (
        <span className="px-2 py-0.5 bg-indigo-900/30 border border-indigo-700/50 text-indigo-300 text-xs rounded-full">
          Shared
        </span>
      )}
    </div>
    <p className="text-sm text-gray-400 mb-1">Owner: {map.owner}</p>
    <p className="text-xs text-gray-500 mb-3">Modified: {map.lastModified}</p>
    <div className="flex gap-2">
      <button
        onClick={() => navigate(`/create?user=${map.owner === "me" ? "editor" : "viewer"}&id=${map.id}`)}
        className={`flex-1 px-4 py-2 rounded text-sm transition ${
          isShared
            ? 'bg-indigo-700 hover:bg-indigo-600'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        Open
      </button>
      {canDelete && (
        <button
          onClick={() => {
            if (window.confirm('Delete this map?')) {
              handleDelete(map.id, isShared);
            }
          }}
          className={`px-4 py-2 rounded text-sm transition ${
            isShared
              ? 'bg-red-950/40 hover:bg-red-900/60 border border-red-800/50'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          Delete
        </button>
      )}
    </div>
  </div>
);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Paste Map Code"
            value={mapCode}
            onChange={(e) => setMapCode(e.target.value)}
            className="w-64 bg-neutral-900 border border-neutral-700 text-black rounded-lg px-4 py-2
                      focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                      transition placeholder-neutral-500"/>
          <button
            onClick={handleImport}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700
                      rounded-lg text-white font-semibold transition shadow
                      hover:shadow-blue-900/40">
            Import
          </button>
        </div>

          <button
            onClick={handleCreateNew}
            className="px-2 py-2 bg-blue-950 hover:bg-blue-700 rounded-lg text-lg font-semibold transition flex items-center gap-1"
          >
          Create New Map
          </button>
        </div>

        {/* Upload */}
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragExit}
          onDrop={handleFileDrop}
          className={`mb-10 border-2 border-dashed rounded-xl p-16 text-center transition-all ${
            isDragging
              ? 'border-blue-400 bg-blue-950/30'
              : 'border-gray-700 bg-gray-900/20'
          }`}
        >
          <p className="text-xl mb-2">Drag and Drop a Concept Map</p>
          <p className="text-gray-400 text-sm">Drop a .json file to import</p>
        </div>

        {/* My concept maps */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">My Concept Maps</h2>
          {myMaps.length === 0 ? (
            <p className="text-gray-500">No maps created yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myMaps.map(map => (
                <MapCard key={map.id} map={map} canDelete={true} isShared={false} />
              ))}
            </div>
          )}
        </section>

        {/* Shared concept maps */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Shared with Me</h2>
          {sharedMaps.length === 0 ? (
            <p className="text-gray-500">No maps shared with you yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sharedMaps.map(map => (
                <MapCard key={map.id} map={map} canDelete={true} isShared={true} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}