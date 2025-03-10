const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/jwt");

const authMiddleware = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ errMessage: "Unauthorized" });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ errMessage: "Invalid token" });
    }
    
    req.user = decoded;
    next();
  });
};

module.exports = authMiddleware;