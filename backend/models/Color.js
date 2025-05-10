const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Color = sequelize.define(
  'Color',
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
    tableName: 'colors',
    timestamps: false,
  }
);

Color.sync({ force: false }).then(() => {
  console.log('Color table ready!');
});

module.exports = Color;