const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const UsuarioSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
      },

    password: {
        type: String,
        required: true
      },
    nombre: {
        type: String,
        required: true
      },
     apellidoP: {
        type: String,
        required: true
      },
    apellidoM: {
        type: String,
        required: true
      },
      
    
    
});

UsuarioSchema.methods.generadorJWT = function(){
    return jwt.sign({
        email: this.email,
        nombre: this.nombre,
        apellidoP: this.apellidoP,
        apellidoM: this.apellidoM
    }, 'c0ntr4s3n14');
}

mongoose.model("usuario",UsuarioSchema);