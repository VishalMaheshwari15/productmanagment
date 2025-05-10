const { Sequelize } = require('sequelize');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') }); // Explicit path

// Debug: Log environment variables
console.log('dotenv config loaded');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);

// Check required environment variables
const requiredEnvVars = ['DB_NAME', 'DB_USER', 'DB_HOST'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD || '', // Fallback to empty string
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

// Check DB connection
async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected!');
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }
}

checkConnection();

module.exports = sequelize;