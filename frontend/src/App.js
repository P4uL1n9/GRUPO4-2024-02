// src/App.js
import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/login';
import Inicio from './components/Inicio';
import DicomViewer from './components/DicomViewer';
import DicomHeader from './components/DicomHeader';
import Registro from './components/Registro';

function App() {
  return (
    <div className="App">
      <nav>
        <h1>
          <ul>
            <li><Link to="/">Registrate</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to ="/login">Inicia Sesión</Link></li>
            
          </ul>
          </h1>
      </nav>
      <Routes>
        <Route path="/" element = {<Registro/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/DicomViewer" element={<DicomViewer />} />
        <Route path="/DicomHeader" element={<DicomHeader />} />
      </Routes>
    </div>
  );
}

export default App;

