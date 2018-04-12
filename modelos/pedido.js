'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
    modelo: {type: String},
    cantidad: {type: Number},
    producto: {type: String},
    talla: {type: null},
    color: {type: null},
    costo: {type: Number},
    venta: {type: null},
    Pedido: {type: null},


})

module.exports = mongoose.model('pedido', pedidoSchema)