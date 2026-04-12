const mongoose = require('mongoose');

const facturaSchema = new mongoose.Schema({
  orden_ingreso: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  telefono: {
    type: String
  },
  descripcion: {
    type: String
  },
  cantidad: {
    type: Number,
    required: true,
    default: 1
  },
  valor_und: {
    type: Number,
    required: true
  },
  valor_total: {
    type: Number,
    required: true
  },
  nota: {
    type: String
  }
}, {
  timestamps: true,
  collection: 'factucris' // Forzamos collection en minúsculas como indicó el usuario
});

module.exports = mongoose.model('Factura', facturaSchema);
