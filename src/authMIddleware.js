const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _includes = require("lodash/includes");

const JWT_KEY = "special-key";
const SALT_ROUNDS_FOR_PASSWORD = 10;
const UNAUTHORIZED_JSON = {
  error: "Unauthorized",
};
const UNAUTHORIZED_STATUS_CODE = 401;
const NO_AUTH_MIDDLEWARE_PATHS = ["/new-login", "/new-signup", "/new-delete"];

const generateToken = (userData, validity) => {
  return new Promise((resolve, reject) => {
    jwt.sign(userData, JWT_KEY, { expiresIn: validity }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_KEY, (err, valid) => {
      if (err) {
        reject(err);
      } else {
        resolve(valid);
      }
    });
  });
};

const authMiddleware = async (req, res, next) => {
  try {
    if (_includes(NO_AUTH_MIDDLEWARE_PATHS, req.path)) {
      next();
    }
    const authToken = req.headers["authorization"];
    const userData = await verifyToken(authToken);
    req.userData = userData;
    next();
  } catch (err) {
    res.status(UNAUTHORIZED_STATUS_CODE).json(UNAUTHORIZED_JSON);
  }
};

module.exports = {
  authMiddleware,
};
