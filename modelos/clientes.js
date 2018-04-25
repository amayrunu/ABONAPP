

'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const usuario=mongoose.model('usuario');

const ClienteSchema = new Schema({
    usuario: {type: Schema.ObjectId,ref: 'usuario'},
    nombre: {type: String},
    numero: {type: String},
    direccion: {type: String},
    foto: {type: String},
    sexo: {type: String}
})

module.exports=mongoose.model('clientes',ClienteSchema)

