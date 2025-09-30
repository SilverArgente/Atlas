import React from 'react';
import { LayoutBox } from './LayoutBox.jsx';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <LayoutBox label="Header" className="h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center space-x-8">
            <div className="h-6 w-32 bg-gray-400 rounded"></div>
            <nav className="flex space-x-6">
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
              <div className="h-4 w-28 bg-gray-300 rounded"></div>
            </nav>
          </div>
          <div className="h-8 w-16 bg-gray-400 rounded"></div>
        </div>
      </LayoutBox>

      {/* Hero Section */}
      <LayoutBox label="Hero Section" className="h-96 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-300 rounded-sm"></div>
        <div className="relative z-10 flex h-full">
          {/* Hero Content */}
          <div className="flex-1 flex flex-col justify-center px-8 space-y-4">
            <div className="h-8 w-80 bg-white bg-opacity-90 rounded shadow"></div>
            <div className="space-y-2">
              <div className="h-4 w-64 bg-white bg-opacity-80 rounded"></div>
              <div className="h-4 w-48 bg-white bg-opacity-80 rounded"></div>
            </div>
            <div className="h-10 w-32 bg-white bg-opacity-90 rounded shadow mt-4"></div>
          </div>
          
          {/* Login Form */}
          <LayoutBox label="Quick Login" className="w-64 m-6 bg-white">
            <div className="space-y-4">
              <div className="h-4 w-16 bg-gray-400 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
              <div className="h-9 w-full bg-gray-400 rounded"></div>
            </div>
          </LayoutBox>
        </div>
      </LayoutBox>

      {/* Services Section */}
      <div className="p-8">
        <LayoutBox label="Services Section" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Banking/services cards temporarily hidden */}
            {false && (
              <>
                {/* Main Service Card */}
                <div className="md:col-span-1">
                  <LayoutBox label="Primary Service" className="h-48">
                    <div className="space-y-3">
                      <div className="w-8 h-8 bg-gray-400 rounded-full"></div>
                      <div className="h-5 w-32 bg-gray-400 rounded"></div>
                      <div className="h-5 w-24 bg-gray-400 rounded"></div>
                      <div className="space-y-2 mt-4">
                        <div className="h-3 w-full bg-gray-300 rounded"></div>
                        <div className="h-3 w-4/5 bg-gray-300 rounded"></div>
                        <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </LayoutBox>
                </div>

                {/* Service Cards */}
                {["Personal Banking", "Business Banking", "Private Banking"].map((service, index) => (
                  <div key={index}>
                    <LayoutBox label={service} className="h-48">
                      <div className="space-y-3">
                        <div className="h-16 w-full bg-gray-300 rounded"></div>
                        <div className="h-4 w-3/4 bg-gray-400 rounded"></div>
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-gray-300 rounded"></div>
                          <div className="h-3 w-5/6 bg-gray-300 rounded"></div>
                          <div className="h-3 w-4/5 bg-gray-300 rounded"></div>
                        </div>
                        <div className="h-3 w-20 bg-gray-400 rounded mt-4"></div>
                      </div>
                    </LayoutBox>
                  </div>
                ))}
              </>
            )}
          </div>
        </LayoutBox>
      </div>

      {/* Features Section */}
      <div className="px-8 pb-8">
        <LayoutBox label="Features Section" className="p-6">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="h-6 w-48 bg-gray-400 rounded mx-auto"></div>
              <div className="h-4 w-64 bg-gray-300 rounded mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((feature) => (
                <div key={feature} className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto"></div>
                  <div className="h-4 w-24 bg-gray-400 rounded mx-auto"></div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-300 rounded"></div>
                    <div className="h-3 w-4/5 bg-gray-300 rounded mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </LayoutBox>
      </div>

      {/* Footer */}
      <LayoutBox label="Footer" className="h-32 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-full">
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-400 rounded"></div>
            <div className="space-y-1">
              <div className="h-3 w-16 bg-gray-300 rounded"></div>
              <div className="h-3 w-20 bg-gray-300 rounded"></div>
              <div className="h-3 w-14 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-400 rounded"></div>
            <div className="space-y-1">
              <div className="h-3 w-18 bg-gray-300 rounded"></div>
              <div className="h-3 w-16 bg-gray-300 rounded"></div>
              <div className="h-3 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 bg-gray-400 rounded"></div>
            <div className="space-y-1">
              <div className="h-3 w-14 bg-gray-300 rounded"></div>
              <div className="h-3 w-18 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-18 bg-gray-400 rounded"></div>
            <div className="flex space-x-2">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </LayoutBox>
    </div>
  );

}
