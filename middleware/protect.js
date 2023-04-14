const protect = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized to access" });
  }

  req.user = req.session.user;
  next();
};

module.exports = { protect };
