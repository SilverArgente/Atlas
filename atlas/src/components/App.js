import React from 'react';
import Landing from './Landing.js';
import Sandbox from './Sandbox.js';
import LoginPage from './LoginPage.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

  return (
  <AuthProvider>
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/create" element={<Sandbox/>}/>
          <Route path ="/login" element={<LoginPage/>}/>
        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
