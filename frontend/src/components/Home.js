// src/components/About.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import '../styles/styles.css';

function Home() {
  return (
    <body>
    <div className="home-container" style={{ backgroundColor: '#303030', padding: '50px' }}>
            <h1 style={{color:'white'}}>Bienvenido al Visualizador de Imágenes</h1>
            <p style={{color:'white'}}>Accede a tu cuenta o regístrate para empezar.</p>
            <div className="button-container">
                {/* Enlace para Iniciar Sesión */}
                <Link to="/login">
                    <button className="home-button">Iniciar Sesión</button>
                </Link>
                {/* Enlace para Registrarse */}
                <Link to="/registro">
                    <button className="home-button">Registrarse</button>
                </Link>
            </div>
        </div>
        </body>
  );
}

export default Home;