const express = require('express');
const { Sequelize } = require("sequelize");
const db = require("../models");
const userRoutes = require("../routes/userRoutes");
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());
// Ruta de prueba
app.get("/api", (req, res) => {
    res.json({ mensaje: "Hola mi gentesita" });
});

// Rutas para el modelo
app.use('/api/users/login', userRoutes.login);
app.use('/api/users/register', userRoutes.registro)
// Sincronizar modelos con la base de datos
db.sequelize.sync().then(() => {
    // Iniciar el servidor
    app.listen(5000, () => {
        console.log("Servidor iniciado en el puerto 5000");
    });
});

