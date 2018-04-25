'use strict'

const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
    modelo: {type: String},
    cantidad: {type: Number},
    producto: {type: String},
    talla: {type: String},
    color: {type: String},
    costo: {type: Number},
    venta: {type: String},
    pedido: {type: String},


})

module.exports = mongoose.model('pedido', pedidoSchema)