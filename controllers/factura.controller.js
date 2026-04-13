const Factura = require('../models/Factura');

// Crear una nueva factura
exports.createFactura = async (req, res) => {
  try {
    // Calcular el consecutivo automático
    const lastFactura = await Factura.findOne().sort({ orden_ingreso: -1 });
    const nextOrden = lastFactura && lastFactura.orden_ingreso ? lastFactura.orden_ingreso + 1 : 1;
    
    // Asignar el nuevo consecutivo, ignorando si viene en req.body
    const datosFactura = { ...req.body, orden_ingreso: nextOrden };

    const nuevaFactura = new Factura(datosFactura);
    const facturaGuardada = await nuevaFactura.save();
    res.status(201).json(facturaGuardada);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la factura', error: error.message });
  }
};

// Obtener todas las facturas
exports.getFacturas = async (req, res) => {
  try {
    const facturas = await Factura.find().sort({ orden_ingreso: -1 }); // mas recientes primero
    res.status(200).json(facturas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las facturas', error: error.message });
  }
};

// Borrar una factura por ID
exports.deleteFactura = async (req, res) => {
  try {
    const { id } = req.params;
    const facturaEliminada = await Factura.findByIdAndDelete(id);
    if (!facturaEliminada) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    res.status(200).json({ message: 'Factura eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la factura', error: error.message });
  }
};

// Cierre de mes: Suma total y borrado de registros
exports.cierreMes = async (req, res) => {
  try {
    const facturas = await Factura.find();
    
    // Calcular la suma total
    const totalMes = facturas.reduce((acc, current) => acc + (current.valor_total || 0), 0);
    
    // Borrar todas las facturas para reiniciar el consecutivo a 1
    await Factura.deleteMany({});
    
    res.status(200).json({ 
      message: 'Cierre de mes exitoso', 
      total: totalMes,
      facturasBorradas: facturas.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar el cierre de mes', error: error.message });
  }
};
