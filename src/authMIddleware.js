const jwt = require("jsonwebtoken");

// lodash imports
const _includes = require("lodash/includes");

const { readUser, readUserById } = require("./crud");
const {
  UNAUTHORIZED_STATUS_CODE,
  UNAUTHORIZED_JSON,
  NO_AUTH_MIDDLEWARE_PATHS,
  JWT_KEY,
} = require("./constants");
const { verifyToken } = require("./utils");

// TODO: check if the async one works or not as jwt functions are synchronous
// const generateToken = (userData, validity) => {
//   return new Promise((resolve, reject) => {
//     jwt.sign(userData, JWT_KEY, { expiresIn: validity }, (err, token) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(token);
//       }
//     });
//   });
// };
// const generateToken = async (userData, validity) => {
//   // return new Promise((resolve, reject) => {
//   const token = jwt.sign(userData, JWT_KEY, { expiresIn: validity });
//   return token;
// };

// TODO: check if the async one works or not as jwt functions are synchronous
// const verifyToken = (token) => {
//   return new Promise((resolve, reject) => {
//     jwt.verify(token, JWT_KEY, (err, valid) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(valid);
//       }
//     });
//   });
// };
// const verifyToken = async (token) => {
//   const userData = await jwt.verify(token, JWT_KEY);
//   return userData;
// };

const authMiddleware = async (req, res, next) => {
  try {
    if (_includes(NO_AUTH_MIDDLEWARE_PATHS, req.path)) {
      next();
      return;
    }

    const authToken =
      req.headers["Authorization"] || req.headers["authorization"];

    const userData = await verifyToken(authToken);
    const currUserData = await readUserById(
      userData?.userId || userData?.userId
    );
    currUserData.userPassword = undefined;
    req.userData = currUserData;

    next();
  } catch (err) {
    console.log(err);
    res.status(UNAUTHORIZED_STATUS_CODE).json(UNAUTHORIZED_JSON);
  }
};

module.exports = {
  authMiddleware,
};
