const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/sequalize");

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: DataTypes.FLOAT,
  category: {
    type: DataTypes.ENUM("electronics", "clothing", "food"),
    allowNull: false,
  },
});

module.exports = { Product };
