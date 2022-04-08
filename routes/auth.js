const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken, validarCampos } = require('../controllers/auth');
const { validationResult } = require('express-validator');

const router = Router();




//Controladores de cada ruta

// Crear un nuevo usuario
router.post( '/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    (req, res = response, next ) => {
    
        const errors = validationResult( req );
        if ( !errors.isEmpty() ) {
            return res.status(400).json({
                ok: false,
                errors: errors.mapped()
            });
        }
    
        next();
    }
], crearUsuario );

// Login de usuario
router.post( '/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6 }),
    (req, res = response, next ) => {
    
        const errors = validationResult( req );
        if ( !errors.isEmpty() ) {
            return res.status(400).json({
                ok: false,
                errors: errors.mapped()
            });
        }
    
        next();
    }
], loginUsuario );

//Validar y revalidar token
router.get( '/renew', revalidarToken );




module.exports = router;