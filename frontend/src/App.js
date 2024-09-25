// src/App.js
import React from 'react';
import { Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Login from './components/login';
import Inicio from './components/Inicio';
import DicomViewer from './components/DicomViewer';
import DicomHeader from './components/DicomHeader';
import Registro from './components/Registro';
import Logout from './components/logout';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element = {<Home/>}/>
        <Route path="/registro" element = {<Registro/>}/>
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/DicomViewer" element={<DicomViewer />} />
        <Route path="/DicomHeader" element={<DicomHeader />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;

