import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/nav.css';

function NavigationPrincipal() {
    return (
    <nav className="navbar">
      <h1 className="navbar-title">Grupo 4</h1>
      <ul className="navbar-list">
        <li><Link to="/about" className="navbar-link">About</Link></li>
        <li><Link to="/login" className="navbar-link">Inicia Sesión</Link></li>
        <li><Link to="/registro" className="navbar-link">Registrate</Link></li>
      </ul>
    </nav>
    );
  }
  
export default NavigationPrincipal;