const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const materialRoutes = require('./routes/materialRoutes');
const colorRoutes = require('./routes/colorRoutes');
const sizeRoutes = require('./routes/sizeRoutes');
const sequelize = require('./config/db');
require('dotenv').config();

const app = express();

// Debug: Log to confirm dotenv loaded
console.log('Loaded .env:', process.env.DB_NAME);

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/colors', colorRoutes);
app.use('/api/sizes', sizeRoutes);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await sequelize.sync({ force: false });
});