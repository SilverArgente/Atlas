import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutBox } from './LayoutBox.jsx';

import njitLogo from "../assets/njit.jpg";
import study from "../assets/study.jpg";
import teach from "../assets/teacher.png";
import teach2 from "../assets/teacher2.png";
import Header from "./Header";


export default function Landing() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Hero Section */}
      <LayoutBox className="h-96 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-300 rounded-sm"><img src={njitLogo} alt="NJIT" className="w-full h-full object-cover rounded-sm"/></div>
        <div className="relative z-10 flex h-full">
          
          {/* Login Form */}
        </div>
      </LayoutBox>

      {/* Features Section */}
      <div className="px-8 pb-8">
        <LayoutBox className="p-6">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1><strong>Testimonials</strong></h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 1, name: "Alice", text: "This service is amazing!", img: study},
              { id: 2, name: "Bob", text: "I learned so much here.", img: teach },
              { id: 3, name: "Carol", text: "Highly recommend to everyone.", img: teach2 },
            ].map((feature) => (
              <div key={feature.id} className="text-center space-y-3">
                {/* Real profile image */}
                <img
                  src={feature.img}
                  alt={feature.name}
                  className="w-12 h-12 rounded-full mx-auto object-cover"
                />
                
                {/* Name */}
                <p className="font-semibold">{feature.name}</p>
                
                {/* Testimonial text */}
                <p className="text-sm text-gray-600">{feature.text}</p>
              </div>
            ))}
          </div>
          </div>
        </LayoutBox>
      </div>

      {/* Footer */}
      <LayoutBox className="h-32 mt-8">
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
