const Sequelize = require("sequelize");

const sequelize = new Sequelize("sqlite::memory:");

const sequelizeConnect = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, sequelizeConnect };
