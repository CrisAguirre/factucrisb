const mongoose = require('mongoose');

const cierreSchema = new mongoose.Schema({
  mes_nombre: {
    type: String,
    required: true // Ej: "Abril 2026"
  },
  fecha_cierre: {
    type: Date,
    default: Date.now
  },
  total_ingresos: {
    type: Number,
    required: true
  },
  cantidad_registros: {
    type: Number,
    required: true
  },
  periodo: {
    inicio: Date,
    fin: Date
  },
  registros: {
    type: Array, // Guardamos un snapshot de los objetos Factura
    required: true
  }
}, {
  timestamps: true,
  collection: 'cierres_historial'
});

module.exports = mongoose.model('Cierre', cierreSchema);
