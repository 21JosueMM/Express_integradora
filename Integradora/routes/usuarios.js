var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require ('bcrypt');

let autetificar = require("../middleware/autentificajwt");

const Usuario = mongoose.model("usuario")

const {body,validationResult} = require ("express-validator");


/* GET users listing. */
router.get('/',autetificar ,async function(req, res, next) {
  let usu = await Usuario.find({});

  res.send(usu);

});

//GET para un solo documento
router.get("/info/:dato", async (req,res)=>{
 
  let usu = await Usuario.findOne({usuario:req.params.dato});

  if(!usu){
    return res.status(400).send("Usuario no encontrado")
  }

  res.send({usu});

});

//Insertar un nuevo usuario
router.post('/registro', [
  body('email').isEmail().withMessage('Email invalido'),
  body('password').isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
  }).withMessage('Se requiere mínimo 8 caracteres, 1 minúscula, 1 mayúscula, 1 símbolo, 1 número'),
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
    .matches(/^[a-zA-Z\s]+$/).withMessage('El nombre solo puede contener letras y espacios'),
  body('apellidoP')
    .trim()
    .notEmpty().withMessage('El apellido paterno es obligatorio')
    .isLength({ min: 3 }).withMessage('El apellido paterno debe tener al menos 3 caracteres')
    .matches(/^[a-zA-Z\s]+$/).withMessage('El apellido paterno solo puede contener letras y espacios'),
  body('apellidoM')
    .trim()
    .notEmpty().withMessage('El apellido materno es obligatorio')
    .isLength({ min: 3 }).withMessage('El apellido materno debe tener al menos 3 caracteres')
    .matches(/^[a-zA-Z\s]+$/).withMessage('El apellido materno solo puede contener letras y espacios')
], async (req, res) => {
  // Manejar los errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Encriptación del password al crear un usuario
    const salt = await bcrypt.genSalt(10);
    const pass_encriptado = await bcrypt.hash(req.body.password, salt);

    const usu_guardado = new Usuario({
      email: req.body.email,  
      password: pass_encriptado,
      nombre: req.body.nombre,
      apellidoP: req.body.apellidoP,
      apellidoM: req.body.apellidoM
    });

    await usu_guardado.save();

    res.status(201).json({ message: 'Usuario creado exitosamente', usu_guardado });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
  }
});



//INICIO DE SESION
router.post("/login",/* requisitos para iniciar sesion password (validaciones)-> */[
  body("email").isEmail().withMessage("El email invalido"),
  body("password").isStrongPassword({minLength:8,
                                     minLowercase:1,
                                     minNumbers:1,
                                     minSymbols:1,
                                     minUppercase:1
  }).withMessage("Se requiere minimo 8 caracteres, 1 sea minuscula, 1 mayuscula, 1 simbolo, 1 numero")
], async (req,res)=>{

  let error = validationResult(req);

  if(!error.isEmpty()){
  return res.status(400).send({errores: error.array()});
  }
  /* aqui terminan las restricciones para actualizar el password */

 let usu = await Usuario.findOne({usuario:req.body.usuario});
 if(!usu){
  return res.status(400).send("Usuario o contraseña incorrectos");
 }

 /* compara el password encriptado de la base de datos */
 //if(req.body.password != usu.password){
 if(!await bcrypt.compare(req.body.password,usu.password)){
  return res.status(400).send("Usuario o contraseña incorrectos");
 }

 //let jwtoken = usu.generadorJWT();
 let usu_enviado={
    msj:"Bienvenido!!!",
    email: usu.usuario,
    jwtoken:  usu.generadorJWT()
 };

 res.send({usu_enviado});

});

module.exports = router;
