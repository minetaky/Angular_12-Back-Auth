
const { response } = require('express');


const crearUsuario = (req, res = response ) => { 

    return res.json({
        ok: true,
        msg: 'Crear usuario /new'
    });

}


const loginUsuario = (req, res) => { 

    return res.json({
        ok: true,
        msg: 'Login de usuario / post'
    });

} 

const revalidarToken =  (req, res) => { 

    return res.json({
        ok: true,
        msg: 'Login de usuario /renew get'
    });

} 



module.exports= {
    crearUsuario,
    loginUsuario,
    revalidarToken
}