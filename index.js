const express = require('express');
const  cors  = require('cors');
const { dbConnection } = require('./db/config');
const path = require('path');

require('dotenv').config();

//console.log( process.env.PORT );
//console.log( process.env );


//crear el servidor//aplicacion de express
const app = express();

//Base de Datos MongoDB
dbConnection();

//Directorio Publico
app.use( express.static('public') );

//CORS
app.use(cors());

//Lectura y parseo del body
app.use( express.json() );


//Middleware
app.use( '/api/auth', require('./routes/auth') );


// Manejar demás rutas
app.get( '*', (req, res) => {
    res.sendFile( path.resolve( __dirname, 'public/index.html' ) );
} )



app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
} );




