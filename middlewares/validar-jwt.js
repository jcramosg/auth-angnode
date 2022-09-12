const { response } = require("express");

const jwt = require('jsonwebtoken');


const validarJWT = (req, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    try {

        const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);
        req.uid = uid;
        req.name = name;
        // console.log(uid, name);

    } catch (error) {

        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'

        });
    }

    next();
}


module.exports = { validarJWT }