const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/factura.controller');

router.post('/', facturaController.createFactura);
router.get('/', facturaController.getFacturas);
router.delete('/:id', facturaController.deleteFactura);
router.post('/cierre-mes/ejecutar', facturaController.cierreMes);

module.exports = router;
