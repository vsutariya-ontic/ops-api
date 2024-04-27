import jwt from "jsonwebtoken";
import _includes from "lodash/includes";
import {
  JWT_KEY,
  NO_AUTH_MIDDLEWARE_PATHS,
  UNAUTHORIZED_JSON,
  UNAUTHORIZED_STATUS_CODE,
} from "../../constants/constants";
import { readUserById } from "../../data/user/userOperations";

interface UserDataToken {
  userId: string;
  userRole: string;
}

interface UserData {
  userId: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  userRole: string;
  defaultTable: string;
}

// TODO: check if the async one works or not as jwt functions are synchronous
export const generateToken = (userData: UserDataToken, validity) => {
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

// TODO: check if the async one works or not as jwt functions are synchronous
const verifyToken = (token: string): Promise<UserData> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_KEY, (err, valid: UserData) => {
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
      return;
    }

    const authToken =
      req.headers["Authorization"] || req.headers["authorization"];

    const userDataToken: UserDataToken = await verifyToken(authToken);

    const userData = await readUserById(userDataToken.userId);
    console.log(userData);
    userData.userPassword = undefined;
    req.userData = userData;

    next();
  } catch (err) {
    console.log(err);
    res.status(UNAUTHORIZED_STATUS_CODE).json(UNAUTHORIZED_JSON);
    return;
  }
};

export { authMiddleware };
