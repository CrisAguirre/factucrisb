const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/factura.controller');

router.post('/', facturaController.createFactura);
router.get('/', facturaController.getFacturas);

module.exports = router;
