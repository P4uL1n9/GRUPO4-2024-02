const express = require('express');
const router = express.Router();
const db = require('../models');
// Ruta del login
const login = async (req, res) => {
    const { nombre, password } = req.body;
    try {
        const user = await db.User.findOne({ where: { nombre, password } });
        if (!user) {
            return res.status(401).json({ error: 'Datos Incorrectos' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};
// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await db.User.findAll();
        res.json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Ruta para obtener un usuario por su ID
router.get('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error("Error al obtener usuario por ID:", error);
        res.status(500).json({ error: 'Error al obtener usuario por ID' });
    }
});

// Ruta para crear un nuevo usuario

const registro = async (req, res) => {
    const { nombre, password, email } = req.body;
    try {
        // Verificar si el usuario ya existe
        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'El usuario ya existe' });
        }

        // Crear el nuevo usuario sin encriptar la contraseña
        const newUser = await db.User.create({ nombre, password, email });
        res.status(201).json({ success: true, message: 'Usuario registrado correctamente', user: newUser });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ success: false, message: 'Error al crear usuario' });
    }
};

// Ruta para actualizar un usuario existente por su ID
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { nombre, password, email } = req.body;
    try {
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        user.nombre = nombre;
        user.password = password;
        user.email = email;
        await user.save();
        res.json(user);
    } catch (error) {
        console.error("Error al actualizar usuario por ID:", error);
        res.status(500).json({ error: 'Error al actualizar usuario por ID' });
    }
});

// Ruta para eliminar un usuario por su ID
router.delete('/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        await user.destroy();
        res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error("Error al eliminar usuario por ID:", error);
        res.status(500).json({ error: 'Error al eliminar usuario por ID' });
    }
});

module.exports ={login,registro};