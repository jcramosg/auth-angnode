const { response, json } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



const crearUsuario = async(req, res = response) => {
    const { name, email, password } = req.body;

    try {
        //verifiicar email no repetido
        const usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'El Usuario ya existe con ese Email'
            });
        }


        //crear el Usuario con el Modelo
        const dbUser = new Usuario(req.body);

        //hashear la contraseña
        const salt = bcrypt.genSaltSync();
        dbUser.password = bcrypt.hashSync(password, salt);

        //generar JWT (1
        const token = await generarJWT(dbUser.uid, name);

        //crear el Usuario de la Base de Datos
        await dbUser.save();
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            email,
            token
            // msg: 'El Usuario fue dado de alta!',

        })

        //generar Respuesta

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'No se logro dar de Alta comuníquese con el Administrador del Sistema'
                // uid: dbUser.id,
                // name
        });

    }


};

const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;
    try {

        const dbUser = await Usuario.findOne({ email })

        if (!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'Correo o Contraseña Erroneos.'
            })
        }

        //confirmar si el password hace match

        const validPassword = bcrypt.compareSync(password, dbUser.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Correo o Contraseña Erroneos'
            })
        }

        // Generar ek JWT
        //generar JWT  -2
        const token = await generarJWT(dbUser.id, dbUser.name);

        //Respuesta del Servcio


        return res.json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            token,

        })


    } catch (error) {

        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Comuníquese con el Administrador del Sistema'
        })
    }



}


const revalidarToken = async(req, res = response) => {

    const { uid } = req;

    const dbUser = await Usuario.findById(uid);


    const token = await generarJWT(uid, dbUser.name);

    return res.json({
        ok: true,
        uid: uid,
        name: dbUser.name,
        email: dbUser.email,
        token
    });
}

module.exports = { crearUsuario, loginUsuario, revalidarToken };