
const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



const crearUsuario = async(req, res = response ) => { 

    const {email, name, password} = req.body;

    try{

        //Verificar que no exista un correo igual
        const usuario = await Usuario.findOne({ email });

        if ( usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe con ese email'
            });
        }
        
        //Crear el usuario con nuestro modelo
        const dbUser = new Usuario( req.body );

        const texto1 = '' + ( (password != 'undefined' && password != '')  ? new String(password).toString: '');

        //Hashear la constraseña, encriptarla
        const salt = await bcrypt.genSaltSync(10); //Por default son 10 vueltas
        dbUser.password = bcrypt.hashSync( texto1 , salt );


        //Generar el Json Web Token para que Angular la use como tecnica de autenticacion pasiva
        const token = await generarJWT( dbUser.id, dbUser.name );

        //Crear usuario de DB
        await dbUser.save();

        //Generar respuesta exitosa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name,
            token
        });

    } catch (error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }





}


const loginUsuario = ( req, res = response ) => { 


    const { email, password} = req.body;

    return res.json({
        ok: true,
        msg: 'Login de usuario / post'
    });

} 

const revalidarToken =  (req, res = response) => { 

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