'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
    modelo: {type: String},
    cantidad: {type: Number},
    producto: {type: String},
    talla: {type: Number},
    color: {type: String},
    costo: {type: Number},
    venta: {type: Number},
    pedido: {type: Number},


})

module.exports = mongoose.model('pedido', pedidoSchema)