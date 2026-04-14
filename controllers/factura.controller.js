const Factura = require('../models/Factura');
const Counter = require('../models/Counter');
const Cierre = require('../models/Cierre');

// Crear una nueva factura
exports.createFactura = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { id: 'factura_orden' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const nextOrden = counter.seq;
    
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
    const facturas = await Factura.find().sort({ orden_ingreso: -1 });
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

// Cierre de mes: Suma total, GUARDADO EN HISTORIAL y borrado de registros
exports.cierreMes = async (req, res) => {
  try {
    const facturas = await Factura.find().sort({ orden_ingreso: 1 });
    
    if (facturas.length === 0) {
      return res.status(400).json({ message: 'No hay recibos para cerrar el mes.' });
    }

    const totalMes = facturas.reduce((acc, current) => acc + (current.valor_total || 0), 0);
    const fechaInicio = facturas[0].fecha;
    const fechaFin = facturas[facturas.length - 1].fecha;
    
    const opcionesMes = { month: 'long', year: 'numeric' };
    const mesNombreRaw = new Intl.DateTimeFormat('es-ES', opcionesMes).format(new Date(fechaFin));
    const mesNombre = mesNombreRaw.charAt(0).toUpperCase() + mesNombreRaw.slice(1);

    const nuevoCierre = new Cierre({
      mes_nombre: mesNombre,
      total_ingresos: totalMes,
      cantidad_registros: facturas.length,
      periodo: {
        inicio: fechaInicio,
        fin: fechaFin
      },
      registros: facturas 
    });

    await nuevoCierre.save();
    await Factura.deleteMany({});
    
    res.status(200).json({ 
      message: 'Cierre de mes exitoso y guardado en historial', 
      total: totalMes,
      facturasBorradas: facturas.length,
      cierre: nuevoCierre
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al procesar el cierre de mes', error: error.message });
  }
};

// Obtener historial de cierres
exports.getCierres = async (req, res) => {
  try {
    const cierres = await Cierre.find().sort({ fecha_cierre: -1 });
    res.status(200).json(cierres);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el historial de cierres', error: error.message });
  }
};

// Obtener detalle de un cierre específico
exports.getCierreById = async (req, res) => {
  try {
    const cierre = await Cierre.findById(req.params.id);
    if (!cierre) return res.status(404).json({ message: 'Cierre no encontrado' });
    res.status(200).json(cierre);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el detalle del cierre', error: error.message });
  }
};
