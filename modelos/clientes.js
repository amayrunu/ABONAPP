'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const ClienteSchema = new Schema({
    nombre: {type: String},
    numero: {type: Number},
    direccion: {type: String},
    foto: {type: String},
    sexo: {type: String}
})

module.exports=mongoose.model('clientes',ClienteSchema)

