'use strict'

const config = require('../config/database');
const jwt = require('jsonwebtoken');
const Usuario= require('../modelos/usuario');
const Cliente = require('../modelos/clientes');
const Pedido = require('../modelos/pedido');


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
                   
                    const token = jwt.sign({usuarioId: usuario._id}, config.secret,{expiresIn: '24h'});
                            res.json({success: true, message: 'Usuario autenticado', token:token})
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
        let cliente = new Cliente();
        cliente.usuario=req.body.usuario;
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
    router.get('/clientes', (req,res)=>{
        Cliente.find({}, (err, cliente )=>{
            if (err) {
                res.json({succes: false, message: err})
            } else {
                res.json({succes: true, message: cliente})
            }
        })
    })

    router.get('/obtenerperfil/:clienteId', (req,res)=>{
        let clienteId = req.params.clienteId
        Cliente.findById(clienteId, (err, cliente)=>{
            if(err) return res.status(500).send ({message: `error al encontrar al cliente: ${err}`})
            if(!cliente) return res.status(404).send({message: `el cliente no existe`})
            res.status(200).send({cliente})
        })
    })

    router.put('/actualizarcliente/:clienteId', (req,res) => {
        let clienteId =req.params.clienteId
        let update = req.body
        
        Cliente.findByIdAndUpdate(clienteId, update, (err, clienteUpdate)=>{

            if(err)res.status(500).send({message: `error al actualizar al cliente: ${err}`})
            res.status(200).send({cliente: clienteUpdate + 'cliente actualizado..'})
        })
    })

      

    router.delete('/eliminarclientes/:clienteId', (req,res) =>{
        let clienteId = req.params.clienteId
        Cliente.findById(clienteId, (err, cliente)=>{
            if(err) return res.status(500).send ({message: `error al borrar al cliente: ${err}`})
        cliente.remove(err =>{
            if(err) return res.status(500).send ({message: `error al borrar al cliente: ${err}`})
            res.status(200).send({message: ' el cliente ha sido eliminado'})
        })
            
        })
    })



router.post('/registrarpedido',(req,res)=>{
    let pedido = new Pedido();
    pedido.modelo =req.body.modelo;
    pedido.cantidad = req.body.cantidad;
    pedido.producto = req.body.producto;
    pedido.talla= req.body.talla;
    pedido.color = req.body.sexo;
    pedido.costo = req.body.costo;
    pedido.venta = req.body.venta;
    pedido.pedido = req.body.pedido;

    pedido.save((err)=>{
        if(err){
            if(err.code == 11000){
                res.json({success: false, message: 'El pedido ya esta registrado'})
            }else{
                res.json({success:false, message: err})
            }
        }else{
            res.json({success: true, message: 'Pedido registrado'})
        }
    })
})

 router.get('/pedidos', (req,res)=>{
        Pedido.find({}, (err, pedido )=>{
            if (err) {
                res.json({succes: false, message: err})
            } else {
                res.json({succes: true, message: pedido})
            }
        })
    })

    router.get('/obtenerpedido/:pedidoId', (req,res)=>{
        let pedidoId = req.params.pedidoId
        Pedido.findById(pedidoId, (err, pedido)=>{
            if(err) return res.status(500).send ({message: `error al encontrar el pedido: ${err}`})
            if(!pedido) return res.status(404).send({message: `el pedido no existe`})
            res.status(200).send({pedido})
        })
    })

    router.put('/actualizarpedido/:pedidoId', (req,res) => {
        let pedidoId =req.params.pedidoId
        let update = req.body
        
        Pedido.findByIdAndUpdate(pedidoId, update, (err, pedidoUpdate)=>{

            if(err)res.status(500).send({message: `error al actualizar el pedido: ${err}`})
            res.status(200).send({pedido: pedidoUpdate + 'pedido actualizado..'})
        })
    })

    router.delete('/eliminarpedido/:pedidoId', (req,res) =>{
        let pedidoId = req.params.clienteId
        Pedido.findById(pedidoId, (err, pedido)=>{
            if(err) return res.status(500).send ({message: `error al borrar el pedido: ${err}`})

        Pedido.remove(err =>{
            if(err) return res.status(500).send ({message: `error al borrar el pedido: ${err}`})
            res.status(200).send({message: ' el pedido ha sido eliminado'})
        })
            
        })
    })

    return router


}