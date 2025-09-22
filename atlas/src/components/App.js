import React from 'react';
import Landing from './Landing.js';
import Sandbox from './Sandbox.js';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>

        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/create" element={<Sandbox/>}/>
        
        </Routes>

      </BrowserRouter>
  );

}

export default App;
