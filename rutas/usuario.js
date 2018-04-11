'use strict'

const config = require('../config/database');
const jwt = require('jsonwebtoken');
const User= require('../modelos/usuario');

module.exports = (router) =>{
    router.post('/registro', (req, res)=>{
        let usuario= new Usuario();
        if(!req.body.correo){
            res.json({success: false, message: ' Favor de ingresar el correo electronico'})
        }else{
            usuario.nombre     =  req.body.nombre;
            usuario.correo     =  req.body.correo;
            usuario.telefono   =  req.body.telefono;
            usuario.contrasena =  req.body.contrasena;
            usuario.confirmar  =  req.body.confirmar;

            usuario.save((err)=>{
                if(err){
                    if (err.code == 11000) {
                        res.json({success: false, message: 'El Correo ya existe...'})
                    }else{
                        res.json({success: false, message: err})
                    }
                }else{
                    res.json({success: true, message: 'Usuario Guardado'})
                }
            })
        }

    })

    router.post('/iniciosesion',(req,res)=>{
        if(!req.body.correo){
            res.json({success: false, message: 'Ingresar el correo '})
        }else if(!req.body.contrasena){
            res.json({success: false, message: 'Ingresar una contraseña'})
        }else{
            Usuario.findOne({correo:req.body.correo}, (err,usuario)=>{
                if(err){
                    res.json({success: false, message: err})
                }else{
                    if(!usuario){
                        res.json({success: false, message: 'Usuario no encontrado..'})
                    }else{
                        const validPassword = usuario.comparePass(req.body.contrasena);
                        if(!validPassword) {
                            res.json({success: false, message: 'Contraseña Incorrecta..'})
                        }else{
                            const token = jwt.sign({usuarioId: usuario._id}, config.secret,{expiresIn: '24h'});
                            res.json({success: true, message: 'Usuario autenticado', token:token})
                        }
                    }
                }
            }) 
        }
    })

    //Midleware
    router.use((req,res,next)=>{
        const token= req.headers['autorizacion'];
        if(!token){
            res.json({success: false, message: ' token requerido'})
        }else{
            jwt.verify(token, config.secret, (err, decoded)=>{
                if(err){
                    res.json({success: false, message: 'Token Invalido..' + err})
                }else{
                    req.decoded=decoded;
                    next();
                }
            })
        }
    })
    return router

}