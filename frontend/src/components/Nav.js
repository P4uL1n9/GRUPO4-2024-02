import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/nav.css';

function Navigation() {
  return (
  <nav className="navbar">
    <h1 className="navbar-title">Grupo 4</h1>
    <ul className="navbar-list">
      <li><Link to="/Inicio" className="navbar-link">Inicio</Link></li>
      <li><Link to="/DicomViewer" className="navbar-link">DicomViewer</Link></li>
      <li><Link to="/" className="navbar-link">Salida</Link></li>
    </ul>
  </nav>
  );
}

export default Navigation;