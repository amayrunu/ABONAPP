'use strict'
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./config/database');
const router = express.Router();
const usuarios= require('./rutas/usuario')(router);
const bodyParser = require('body-parser');
const port = process.env.port || 3000

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err)=>{
    if(err) {
        console.log("conectado")
    }
});
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use('/usuario',usuarios)


app.listen(port, ()=>{
    console.log("conectado"+ port)
});
