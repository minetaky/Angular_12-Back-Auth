
const express = require('express');

//crear el servidor//aplicacion de express
const app = express();


//Middleware
app.use( '/api/auth', require('./routes/auth') );



app.listen( 4000, () => {
    console.log(`Servidor corriendo en puerto ${ 4000 }`);
} );




