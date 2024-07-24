const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Product = require('../models/materiaPrima');
//const Product = require('./producto');

// Obtener todos los productos
router.get('/', async function(req, res) {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener un producto por ID
router.get('/:id', [
  param('id').isMongoId().withMessage('ID de producto no válido')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Producto no encontrado' });
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Crear un nuevo producto
router.post('/', [
  body('materiaPrima').notEmpty().withMessage('La materia prima es requerida'),
  body('fechaRecepcion').isDate().withMessage('La fecha de recepción debe ser una fecha válida'),
  body('cantidadRecibida').isInt({ gt: 0 }).withMessage('La cantidad recibida debe ser un número mayor que 0'),
  body('numeroLote').notEmpty().withMessage('El número de lote es requerido'),
  body('fechaCaducidad').isDate().withMessage('La fecha de caducidad debe ser una fecha válida')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).send(savedProduct);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Actualizar un producto por ID
router.put('/:id', [
  param('id').isMongoId().withMessage('ID de producto no válido'),
  body('materiaPrima').optional().notEmpty().withMessage('La materia prima es requerida'),
  body('fechaRecepcion').optional().isDate().withMessage('La fecha de recepción debe ser una fecha válida'),
  body('cantidadRecibida').optional().isInt({ gt: 0 }).withMessage('La cantidad recibida debe ser un número mayor que 0'),
  body('numeroLote').optional().notEmpty().withMessage('El número de lote es requerido'),
  body('fechaCaducidad').optional().isDate().withMessage('La fecha de caducidad debe ser una fecha válida')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).send({ message: 'Producto no encontrado' });
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Eliminar un producto por ID
router.delete('/:id', [
  param('id').isMongoId().withMessage('ID de producto no válido')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send({ message: 'Producto no encontrado' });
    }
    res.status(200).send({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
