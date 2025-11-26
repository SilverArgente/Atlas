import React, { useState } from 'react';

export default function SaveMapModal({ isOpen, onClose, onSave }) {
  const [mapName, setMapName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!mapName.trim()) {
      setError('Please enter a name');
      return;
    }
    onSave(mapName.trim());
    setMapName('');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-wrapper fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 border-2 border-gray-600 rounded-lg p-6 w-96 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 !text-white">Save Concept Map</h2>
        
        <input
          type="text"
          value={mapName}
          onChange={(e) => {
            setMapName(e.target.value);
            setError('');
          }}
          onKeyPress={handleKeyPress}
          placeholder="Enter map name..."
          className="w-full !px-4 !py-3 !bg-gray-700 !border !border-gray-500 rounded !mb-2 !text-white placeholder-gray-400 focus:outline-none focus:!border-blue-500 focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
        
        {error && <p className="!text-red-400 text-sm mb-4 font-semibold">{error}</p>}
        
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            className="flex-1 !px-4 !py-3 !bg-blue-600 hover:!bg-blue-700 rounded transition !text-white font-semibold !border-none !m-0"
          >
            Save
          </button>
          <button
            onClick={() => {
              setMapName('');
              setError('');
              onClose();
            }}
            className="!px-6 !py-3 !bg-gray-600 hover:!bg-gray-500 rounded transition !text-white font-semibold !border-none !m-0"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}