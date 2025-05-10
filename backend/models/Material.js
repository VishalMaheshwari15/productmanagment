const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Material = sequelize.define(
  'Material',
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
    tableName: 'materials',
    timestamps: false,
  }
);

Material.sync({ force: false }).then(() => {
  console.log('Material table ready!');
});

module.exports = Material;