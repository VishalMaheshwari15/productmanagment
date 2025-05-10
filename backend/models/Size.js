const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Size = sequelize.define(
  'Size',
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
    tableName: 'sizes',
    timestamps: false,
  }
);

Size.sync({ force: false }).then(() => {
  console.log('Size table ready!');
});

module.exports = Size;