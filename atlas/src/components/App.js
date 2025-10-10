import React from 'react';
import Landing from './Landing.js';
import Sandbox from './Sandbox.js';
import LoginPage from './LoginPage.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import SignupPage from './SignupPage.jsx';
function App() {

  return (
  <AuthProvider>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/create" element={<Sandbox/>}/>
          <Route path ="/login" element={<LoginPage/>}/>
          <Route path ="/signup" element={<SignupPage/>}/>
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
