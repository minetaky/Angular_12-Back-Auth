
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

        //const texto1 = '' + ( (password != 'undefined' && password != '')  ? new String(password).toString: '');

        //Hashear la constraseña, encriptarla
        const salt = await bcrypt.genSaltSync(10); //Por default son 10 vueltas
        dbUser.password = bcrypt.hashSync( ''+password, salt );


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






const loginUsuario = async( req, res = response ) => { 


    const { email, password} = req.body;
    const texto1 = '' + ( (password != 'undefined' && password != '')  ? new String(password).toString: '');


    try {

        const dbUser = await Usuario.findOne( { email } );

        if( !dbUser ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            });
        }


        //Confirmar sí el password es valido
        console.log(`${password},  ${dbUser.password}`)
        const validPassword = bcrypt.compareSync( ''+password, dbUser.password  );
        console.log('validPassword: ' + validPassword);

        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'El password no es válido'
            });
        }


        //Generar el Json Web Token para que Angular la use como tecnica de autenticacion pasiva
        const token = await generarJWT( dbUser.id, dbUser.name );

        //Respuesta del serviio
        return res.status(200).json({
            ok: true,
            uid: dbUser.id,
            name: dbUser.name,
            token
        });


        
    } catch (error) {
        console.log('Error en auth');
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

} 






const revalidarToken =  async(req, res = response) => { 

    //Son variables que se establecen en el middware: validarJWT ya que este es ejecutado primero y
    //después se llama a: revalidarToken, para cando este último se ejecuta ya se tienen esas variables
    const { uid, name } = req;

    //Generar el Json Web Token para que Angular la use como tecnica de autenticacion pasiva
    const token = await generarJWT( uid, uid );

    return res.status(200).json({
        ok: true,
        uid,
        name,
        token

    });

} 



module.exports= {
    crearUsuario,
    loginUsuario,
    revalidarToken
}