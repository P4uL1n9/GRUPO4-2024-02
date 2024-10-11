// src/components/About.js
import React from 'react';
import NavPrincipal from '../components/NavPrincipal';
import '../styles/styles.css';

function About() {
  return (
    <div>
      <NavPrincipal />
      <div className="about-container">
        <h1>Visualizador de imágenes DICOM</h1>
        <h2>Grupo 4</h2>
      </div>
    </div>
  );
}

export default About;
