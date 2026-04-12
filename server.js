const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const facturaRoutes = require('./routes/factura.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/facturas', facturaRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit(1);
  });
