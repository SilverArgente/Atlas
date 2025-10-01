import React from 'react';
import Landing from './Landing.js';
import Sandbox from './Sandbox.js';
import LoginPage from './LoginPage.jsx';
import About from './About.jsx';
import Contact from './Contact.jsx';
import Pricing from './Pricing.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>

        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/create" element={<Sandbox/>}/>
          <Route path ="/login" element={<LoginPage/>}/>
          <Route path ="/about" element={<About/>}/>
          <Route path ="/contact" element={<Contact/>}/>
          <Route path ="/pricing" element={<Pricing/>}/>
        
        </Routes>

      </BrowserRouter>
  );

}

export default App;
