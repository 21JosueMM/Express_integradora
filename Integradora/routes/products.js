const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('../models/product'); // Asegúrate de que la ruta sea correcta
const autentificar = require("../middleware/autentificajwt");

// Crear un nuevo producto
router.post('/', [
    body('name').notEmpty().withMessage('El nombre del producto es requerido'),
    body('descripcion').notEmpty().withMessage('La descripción es requerida'),
    body('precio').isNumeric().withMessage('El precio debe ser un número'),
    body('stock').isInt({ gt: 0 }).withMessage('El stock debe ser un número mayor que 0'),
    body('materiaPrima').optional().isArray().withMessage('La materia prima debe ser un array'),
    body('materiaPrima.*.materialId').optional().isMongoId().withMessage('El ID del material debe ser válido'),
    body('materiaPrima.*.cantidad').optional().isInt({ gt: 0 }).withMessage('La cantidad debe ser un número mayor que 0')
], autentificar, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).send(savedProduct);
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).send("Error al crear el producto");
    }
});

// Obtener todos los productos
router.get('/', autentificar, async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).send(products);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).send("Error al obtener los productos");
    }
});

// Obtener un producto por ID
router.get('/:id', autentificar, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }
        res.status(200).send(product);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).send("Error al obtener el producto");
    }
});

// Actualizar un producto por ID
router.put('/:id', [
    body('name').optional().notEmpty().withMessage('El nombre del producto es requerido'),
    body('descripcion').optional().notEmpty().withMessage('La descripción es requerida'),
    body('precio').optional().isNumeric().withMessage('El precio debe ser un número'),
    body('stock').optional().isInt({ gt: 0 }).withMessage('El stock debe ser un número mayor que 0'),
    body('materiaPrima').optional().isArray().withMessage('La materia prima debe ser un array'),
    body('materiaPrima.*.materialId').optional().isMongoId().withMessage('El ID del material debe ser válido'),
    body('materiaPrima.*.cantidad').optional().isInt({ gt: 0 }).withMessage('La cantidad debe ser un número mayor que 0')
], autentificar, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.status(404).send("Producto no encontrado");
        }
        res.status(200).send(updatedProduct);
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).send("Error al actualizar el producto");
    }
});

// Eliminar un producto por ID
router.delete('/:id', autentificar, async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).send("Producto no encontrado");
        }
        res.status(200).send({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).send("Error al eliminar el producto");
    }
});

module.exports = router;
