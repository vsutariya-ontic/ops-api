export const PORT = 4000;

export const SALT_ROUNDS_FOR_HASHING = 10;

export const UNAUTHORIZED_STATUS_CODE = 401;

export const JWT_KEY = "special-key";

export const UNAUTHORIZED_JSON = {
  error: "Unauthorized",
};

export const NO_AUTH_MIDDLEWARE_PATHS = ["/login", "/signup"];

export const OrderStatus = {
  IN_CART: "IN_CART",
  PLACED: "PLACED",
  ACCEPTED: "ACCEPTED",
  COMPLETED: "COMPLETED",
};
