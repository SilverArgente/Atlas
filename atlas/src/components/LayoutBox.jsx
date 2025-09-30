import React from 'react';

export function LayoutBox({ children, className = "", label }) {
  return (
    <div className={`border-2 border-dashed border-gray-300 bg-gray-50 relative ${className}`}>
      {label && (
        <div className="absolute top-1 left-2 text-xs text-gray-500 bg-gray-50 px-1">
          {label}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}