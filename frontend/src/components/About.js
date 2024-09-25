// src/components/About.js
import React from 'react';
import NavPrincipal from '../components/NavPrincipal';

function About() {
  return (
    <div>
      <nav style={{backgroundColor: '#ffffff', padding: '10px'}}>
            <NavPrincipal />
      </nav>
      <h1 style={{color:'white'}}>Grupo 4</h1>
      <p style={{color:'white'}}>Visualizador de imagenes</p>
    </div>
  );
}

export default About;
