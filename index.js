require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { dbConnection } = require('./db/config');

// console.log(process.env)

//levantar servidor
const app = express();


//BASE DE DATOS
dbConnection();


//Directorio Publico
app.use(express.static('public'));

//CORS
app.use(cors());

//Lectura y Parseo del Body
app.use(express.json());



app.use('/api/auth', require('./routes/auth'))

//Manejar laas demas rutas de angular
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'))
})


app.listen(process.env.PORT, () => {

    console.log(`Servidor en Puerto ${process.env.PORT} `);

})