const mongoose = require('mongoose');

const materiaPrimaSchema = new mongoose.Schema({
  materiaPrima: {
    type: String,
    required: true
  },
  fechaRecepcion: {
    type: Date,
    required: true
  },
  cantidadRecibida: {
    type: Number,
    required: true
  },
  numeroLote: {
    type: String,
    required: true
  },
  fechaCaducidad: {
    type: Date,
    required: true
  }
});

const Materia_prima = mongoose.model('Materia_Prima', materiaPrimaSchema);

module.exports = Materia_prima;
