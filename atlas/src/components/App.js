import React from 'react';
import Landing from './Landing.js';
import Sandbox from './Sandbox.js';
import SignInPage from './SignInPage.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import SignupPage from './SignupPage.jsx';
import About from './About.jsx';
import Price from './Pricing.jsx';
import Contact from './Contact.jsx';
import Dashboard from './Dashboard';
import Viewer from './Viewer.jsx';

function App() {

  return (
  <AuthProvider>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/create" element={<Sandbox/>}/>
          <Route path ="/signin" element={<SignInPage/>}/>
          <Route path ="/signup" element={<SignupPage/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path ="/pricing" element={<Price/>}/>
          <Route path ="/contact" element={<Contact/>}/>
          <Route path = "/dashboard" element={<Dashboard/>}/>
          <Route path = "/viewer" element={<Viewer/>}/>
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
