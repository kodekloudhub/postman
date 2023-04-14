const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { User } = require("../models/UserModel");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized to access" });
  }

  const decoded = await promisify(jwt.verify)(token, "mysecret");

  const user = await User.findOne({ where: { email: decoded.id } });

  if (!user) {
    return res.status(401).json({ message: "Unauthorized to access" });
  }

  req.user = user;
  next();
};

module.exports = { protect };
