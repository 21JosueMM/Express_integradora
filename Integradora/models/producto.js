const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
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

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
