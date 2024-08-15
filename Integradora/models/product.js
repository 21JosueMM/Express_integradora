const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        descripcion: {
            type: String,
            required: true
        },
        precio: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        materiaPrima: [
            {
                materialId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Materia_Prima', // Asegúrate de que el nombre sea correcto
                    required: true
                },
                cantidad: {
                    type: Number,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
