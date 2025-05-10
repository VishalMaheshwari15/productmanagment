const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define(
  'Category',
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
  },
  {
    tableName: 'categories',
    timestamps: false,
  }
);

Category.sync({ force: false }).then(() => {
  console.log('Category table ready!');
});

module.exports = Category;