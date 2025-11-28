import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate();
  const { createPlan, getUserRecord } =  useAuth();

  // Mock data to show UI until backend is connected
  const [myMaps, setMyMaps] = useState([
    {
      id: '1',
      title: 'CS100',
      createdAt: '2025-11-20',
      lastModified: '2025-11-20',
      owner: 'me',
    }]);

  const [sharedMaps] = useState([
    {
      id: '2',
      title: 'Physics 1',
      createdAt: '2024-11-20',
      lastModified: '2024-11-21',
      owner: 'Dr. Wang',
    },
  ]);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragExit = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
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
        // Import: needs to be implemented
        if (!conceptMapData.nodes || !Array.isArray(conceptMapData.nodes)){
          alert ('Invalid concept map format: missing nodes array');
          return;
        }
        if (!conceptMapData.edges){
          alert ('Invalid concept mpa format: missing edges array')
        }

        //Save to database
        const userRow = await getUserRecord();
        const { data: savedPlan, error } = await createPlan(conceptMapData);
        if( error ) {
          alert('Failed to save concept map');
          return;
        }
        //Add to the displayed list
        const newMap = {
          id: savedPlan.id,
          title: jsonFile.name.replace('.json', ''),
          createdAt: new Date().toISOString().split('T')[0],
          lastModified: new Date().toISOString().split('T]')[0],
          owner: 'me',
        };
      
        setMyMaps([...myMaps, newMap]);

        alert('Imported: jsonFile.name}');
      } catch (err) {
        alert('Invalid concept map file');
      }
    };
    reader.readAsText(jsonFile);
  };

  const MapCard = ({ map, canDelete }) => (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-500 transition">
      <h3 className="text-lg font-semibold mb-2">{map.title}</h3>
      <p className="text-sm text-gray-400 mb-1">Owner: {map.owner}</p>
      <p className="text-xs text-gray-500 mb-3">Modified: {map.lastModified}</p>
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/viewer/${map.id}`)}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition"
        >
          Open
        </button>
        {canDelete && (
          <button
            onClick={() => {
              if (window.confirm('Delete this map?')) {
                //Delete: needs to be implemented
              }
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition"
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
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        {/* Upload */}
        <div
          onDragOver={handleDragEnter}
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
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">My Concept Maps</h2>
          {myMaps.length === 0 ? (
            <p className="text-gray-500">No maps yet. Create one to get started!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myMaps.map(map => (
                <MapCard key={map.id} map={map} canDelete={true} />
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
                <MapCard key={map.id} map={map} canDelete={false} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}