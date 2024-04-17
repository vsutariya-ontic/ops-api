const PORT = 4000;

const SALT_ROUNDS_FOR_HASHING = 10;

const UNAUTHORIZED_STATUS_CODE = 401;

const JWT_KEY = "special-key";

const UNAUTHORIZED_JSON = {
  error: "Unauthorized",
};

const NO_AUTH_MIDDLEWARE_PATHS = ["/new-login", "/new-signup", "/new-delete"];

const OrderStatus = {
  1: "IN_CART",
  2: "PLACED",
  3: "ACCEPTED",
  4: "COMPLETED",
};

module.exports = {
  PORT,
  SALT_ROUNDS_FOR_HASHING,
  UNAUTHORIZED_STATUS_CODE,
  JWT_KEY,
  UNAUTHORIZED_JSON,
  NO_AUTH_MIDDLEWARE_PATHS,
  OrderStatus,
};
