'use strict'

const config = require('../config/database');
const jwt = require('jsonwebtoken');
const Usuario= require('../modelos/usuario');
const Cliente = require('../modelos/clientes');

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

    router.post('/registrarcliente',(req,res)=>{
        let cliente= new Cliente();
        cliente.nombre =req.body.nombre;
        cliente.numero = req.body.numero;
        cliente.direccion = req.body.direccion;
        cliente.foto= req.body.foto;
        cliente.sexo = req.body.sexo;
        
        cliente.save((err)=>{
            if(err){
                if(err.code == 11000){
                    res.json({success: false, message: 'El cliente ya esta registrado'})
                }else{
                    res.json({success:false, message: err})
                }
            }else{
                res.json({success: true, message: 'Cliente registrado'})
            }
        })
    })

    router.get('/obtenerperfil', (req,res)=>{
        cliente.findOne({_id: req.decoded.clienteId},(err,cliente) => {
            if(err){
                res.json({success: false, message: err})
            }else{
                res.json({success: true, message: Cliente})
            }
        })
    })

    router.put('/actualizarcliente', (req,res) => {
        Cliente.findOneAndUpdate({_id: req.decoded.clienteId},{$push: { 'cliente':{
             'nombre': req.body.nombre,
             'numero': req.body.numero,
             'direccion': req.body.direccion,
             'foto': req.body.foto,
             'sexo': req.body.sexo,

        }}},(err,cliente)=>{
            if(err){
                res.json({success: false, message: err})
            }else{
                res.json({success:false, message: 'Campos Actualizados..'})
            }
                      
        })
    })

    router.delete('/eliminarcliente', (req,res) =>{
        cliente.remove({_id: req.decoded.clienteId},(err,cliente) =>{
            if(err) {
                res.json({success: false, message: err})
            }else{
                res.json({success: false, message: 'Cliente eliminado con exito..'})
            }
        })
    })

    return router


}