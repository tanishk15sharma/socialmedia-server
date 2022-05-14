const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  if (req.headers.token === null) {
    return res.status(400).json({
      success: false,
      message: "not authenticated",
    });
  } else if (!req.headers.token) {
    return res.status(400).json({
      success: false,
      message: "no token available ",
    });
  } else {
    let jwtToken = req.headers.token;

    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Token is expired!",
        });
      }
      req.data = decoded;

      next();
    });
  }
};

module.exports = checkAuth;
