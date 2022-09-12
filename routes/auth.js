const { Router, json } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

//Crear nuevo usuario
router.post('/new', [
    check('name', 'el Nombre es obligatorio').not().isEmpty(),
    check('email', 'el email es obligatorio').isEmail(),
    check('password', 'La cintraseña es incorrecta').isLength({ min: 6 }),
    validarCampos

], crearUsuario);


//Login de  usuario
router.post('/', [check('email', 'el email es obligatorio').isEmail(),
    check('password', `La contraseña es incorrecta...`).isLength({ min: 6 }),
    validarCampos
], loginUsuario);

//Validar y Revallidar token de  usuario
router.get('/renew', validarJWT, revalidarToken);

module.exports = router;