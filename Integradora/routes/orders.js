const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ModelOrder = require('../models/order');
const ModelProduct = require('../models/product'); // Asegúrate de que la ruta sea correcta
const autentificar = require("../middleware/autentificajwt");

// Crear una nueva orden
router.post('/', [
    body('cliente').notEmpty().withMessage('El cliente es requerido'),
    body('email').isEmail().withMessage('El correo electrónico debe ser válido'),
    body('estado').isInt({ gt: 0 }).withMessage('El estado debe ser un número mayor que 0'),
    body('direccion').notEmpty().withMessage('La dirección es requerida'),
    body('total').isNumeric().withMessage('El total debe ser un número'),
    body('productos').isArray().withMessage('La lista de productos es requerida'),
    body('productos.*.productId').notEmpty().withMessage('El ID del producto es requerido'),
    body('productos.*.cantidad').isInt({ gt: 0 }).withMessage('La cantidad debe ser un número mayor que 0')
], autentificar, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { productos, ...orderData } = req.body;

        // Crear la orden
        const newOrder = await ModelOrder.create(orderData);

        // Actualizar stock de productos
        for (let producto of productos) {
            const { productId, cantidad } = producto;
            const existingProduct = await ModelProduct.findById(productId);

            if (existingProduct) {
                if (existingProduct.stock < cantidad) {
                    return res.status(400).send(`No hay suficiente stock para el producto ${productId}`);
                }

                existingProduct.stock -= cantidad;
                await existingProduct.save();
            } else {
                return res.status(404).send(`Producto ${productId} no encontrado`);
            }
        }

        res.status(201).send(newOrder);
    } catch (error) {
        console.error("Error al procesar el pedido:", error);
        res.status(500).send("Error al procesar el pedido");
    }
});

// Obtener todas las órdenes
router.get('/', autentificar, async (req, res) => {
    try {
        const orders = await ModelOrder.find({});
        res.status(200).send(orders);
    } catch (error) {
        console.error("Error al obtener las órdenes:", error);
        res.status(500).send("Error al obtener las órdenes");
    }
});

// Obtener una orden por ID
router.get('/:id', autentificar, async (req, res) => {
    try {
        const order = await ModelOrder.findById(req.params.id);
        if (!order) {
            return res.status(404).send("Orden no encontrada");
        }
        res.status(200).send(order);
    } catch (error) {
        console.error("Error al obtener la orden:", error);
        res.status(500).send("Error al obtener la orden");
    }
});

module.exports = router;
