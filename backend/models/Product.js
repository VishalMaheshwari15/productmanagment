const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Category = require('./Category');
const Material = require('./Material');
const Color = require('./Color');
const Size = require('./Size');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    oldPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    specification: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'products',
    timestamps: false,
  }
);

// Setup relationships
Product.belongsTo(Category, { foreignKey: 'categoryId' });
Product.belongsTo(Material, { foreignKey: 'materialId' });
Product.belongsTo(Color, { foreignKey: 'colorId' });
Product.belongsTo(Size, { foreignKey: 'sizeId' });

// Sync table
Product.sync({ force: false }).then(() => {
  console.log('Product table ready!');
});

module.exports = Product;