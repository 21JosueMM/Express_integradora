const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const ModelCustomer = require('../models/customer'); // Asegúrate de que la ruta sea correcta
const autentificar = require("../middleware/autentificajwt");

// Obtener todos los clientes
router.get('/', autentificar, async (req, res) => {
    try {
        const customers = await ModelCustomer.find({});
        res.send(customers);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Obtener un cliente por ID
router.get('/:id', [
    param('id').isMongoId().withMessage('ID de cliente no válido')
], autentificar, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const customer = await ModelCustomer.findById(req.params.id);
        if (!customer) {
            return res.status(404).send({ message: 'Cliente no encontrado' });
        }
        res.send(customer);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Crear un nuevo cliente
router.post('/', [
    body('user').notEmpty().withMessage('El nombre de usuario es requerido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
    body('name').notEmpty().withMessage('El nombre es requerido'),
    body('email').isEmail().withMessage('El correo electrónico debe ser válido'),
    body('tipo_cliente').isInt({ gt: 0 }).withMessage('El tipo de cliente debe ser un número mayor que 0')
], autentificar, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newCustomer = new ModelCustomer(req.body);
        const savedCustomer = await newCustomer.save();
        res.status(201).send(savedCustomer);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Actualizar un cliente por ID
router.put('/:id', [
    param('id').isMongoId().withMessage('ID de cliente no válido'),
    body('user').optional().notEmpty().withMessage('El nombre de usuario es requerido'),
    body('password').optional().notEmpty().withMessage('La contraseña es requerida'),
    body('name').optional().notEmpty().withMessage('El nombre es requerido'),
    body('email').optional().isEmail().withMessage('El correo electrónico debe ser válido'),
    body('tipo_cliente').optional().isInt({ gt: 0 }).withMessage('El tipo de cliente debe ser un número mayor que 0')
], autentificar, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const customer = await ModelCustomer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!customer) {
            return res.status(404).send({ message: 'Cliente no encontrado' });
        }
        res.status(200).send(customer);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Eliminar un cliente por ID
router.delete('/:id', [
    param('id').isMongoId().withMessage('ID de cliente no válido')
], autentificar, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const customer = await ModelCustomer.findByIdAndDelete(req.params.id);
        if (!customer) {
            return res.status(404).send({ message: 'Cliente no encontrado' });
        }
        res.status(200).send({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
