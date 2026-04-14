const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/factura.controller');

// Facturas (Recibos)
router.post('/', facturaController.createFactura);
router.get('/', facturaController.getFacturas);
router.delete('/:id', facturaController.deleteFactura);

// Cierres de Mes
router.post('/cierre-mes/ejecutar', facturaController.cierreMes);
router.get('/cierres', facturaController.getCierres);
router.get('/cierres/:id', facturaController.getCierreById);

module.exports = router;
