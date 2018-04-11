'use strict'

const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    nombre: {type: String},
    correo: {type: String, unique: true, required: true},
    telefono: {type: Number},
    contrasena: {type: String},
    confirmar: {tpe: String}


});

userSchema.pre('save', function(next){
    if(!this.isModified('contrasena')) {
        return next();
    }
    else
    {
        bcrypt.hash(this.contrasena, null, null,(err, hash)=>{
            if(err) return next(err);
            else{
                this.contrasena=hash;
                next();
            }

        })
    }
});

userSchema.methods.comparePass = function(contrasena){
    return bcrypt.compareSync(contrasena, this.contrasena);
}

module.exports=mongoose.model('usuario',userSchema)