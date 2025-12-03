import React from 'react';
import { useNavigate } from 'react-router-dom';
import rocket from "../assets/rocket.png";
import study from "../assets/study.jpg";
import teach from "../assets/teacher.png";
import teach2 from "../assets/teacher2.png";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";


export default function Landing() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-black">
      <Header />
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row h-[80vh] items-center justify-center bg-black px-8 md:px-16">
      {/* Left: Text Content */}
      <div className="flex-1 space-y-6 max-w-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-white">
          Empower Your Learning Journey
        </h1>
        <p className="text-gray-300 text-lg leading-relaxed">
          Share concept maps with friends, and colleagues. Create, and explore on study guides effortlessly.
          Learn smarter, not harder—join Atlas today!
        </p>
      <button
        onClick={() => navigate("/signup")}
        className="mt-4 px-8 py-3 bg-white text-black font-bold rounded-md shadow-md hover:bg-gray-200 transition"
      >
        Try Now
      </button>

      </div>

      {/* Right: Visual Section */}
      <div className="flex-1 flex justify-end items-center mt-10 md:mt-0">
      <img
        src={rocket}
        alt="Learning Illustration"
        className="max-w-[400px] w-full object-cover rounded-lg shadow-lg border border-gray-700"
      />
    </div>

    </div>

      {/* Features Section */}
      <div className="px-8 pb-8">
        <div className="p-6 bg-black">
          <div className="space-y-6">
            <div className="text-center space-y-2 font-bold text-white">
            <h1><strong>-----------------------------------------</strong></h1>
              <h1><strong>Customer Testimonials</strong></h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-white">
            {[
              { id: 1, name: "Alice", text: "This service is amazing!", img: study},
              { id: 2, name: "Bob", text: "I learned so much here.", img: teach },
              { id: 3, name: "Carol", text: "Highly recommend to everyone.", img: teach2 },
            ].map((feature) => (
              <div key={feature.id} className="text-center space-y-3 text-white">
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
        </div>
      </div>
      <Footer />
    </div>
  );

}
