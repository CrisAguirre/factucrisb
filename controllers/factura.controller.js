const Factura = require('../models/Factura');

// Crear una nueva factura
exports.createFactura = async (req, res) => {
  try {
    const nuevaFactura = new Factura(req.body);
    const facturaGuardada = await nuevaFactura.save();
    res.status(201).json(facturaGuardada);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la factura', error: error.message });
  }
};

// Obtener todas las facturas
exports.getFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find().sort({ orden_ingreso: -1 }); // mas recientes primero o depende
    res.status(200).json(facturas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las facturas', error: error.message });
  }
};
