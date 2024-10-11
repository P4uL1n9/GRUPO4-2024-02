import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavPrincipal from '../components/NavPrincipal';
import '../styles/inicio.css';
import '../styles/Login.css'; // Asegúrate de importar tu hoja de estilos

function Login() {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, password }),
        });
        const data = await response.json();
        if (data.success) {
            navigate('/Inicio');
        } else {
            setError('Datos Incorrectos')
        }
    };

    return (
        <div>
        <NavPrincipal />
        <body>
        <div className="login-container"> 
            <h1 className="title">Visualizador de Imágenes</h1>
            <h2>Iniciar sesión</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="submit-button">Login</button>
            </form>
        </div>
        </body>
        </div>
    );
}

export default Login;

