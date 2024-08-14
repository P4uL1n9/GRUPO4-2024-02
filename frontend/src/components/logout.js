import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Realiza una solicitud para cerrar sesión en el backend si es necesario
            await fetch('http://localhost:5000/api/users/logout', {
                method: 'POST',
                credentials: 'include', // Incluye cookies si es necesario
            });

            // Redirige al usuario a la página de registro
            navigate('/Registro');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            // Puedes redirigir al usuario a una página de error o mostrar un mensaje
        }
    };

    useEffect(() => {
        handleLogout();
    }, []);

    return (
        <div>
            <h1>Cerrando sesión...</h1>
        </div>
    );
}

export default Logout;