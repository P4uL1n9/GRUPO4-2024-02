const {User} = require('../models');

exports.createUser= async(req,res) => {
    try{
        const newUser= await User.create(req.body);
        res.status(201).json(newUser);
    }catch(error){
        console.error('Error al crear usuario:',error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};


exports.getAllUser = async(req,res) => {
    try{
        const users = await User.findAll();
        res.json(users);
    }catch(error){
        console.error("Error al obtener los usuarios;",error);
        res.status(500).json({error:'Error al obtener usuarios'});
    }
};