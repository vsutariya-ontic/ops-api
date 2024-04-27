import bcrypt from "bcrypt";
import _isEmpty from "lodash/isEmpty";
import { SALT_ROUNDS_FOR_HASHING } from "../constants/constants";
import { createUser, readUser, updateUser } from "../data/user/userOperations";
import { generateToken } from "../middlewares/auth/authMIddleware";
import { getResponseJson } from "../utils/jsonUtils";

/* user api call handlers */
const handlePostLogin = async (request, response) => {
  try {
    const { userEmail, userPassword, userRole } = request.body;
    const user = await readUser(userEmail, userRole);

    if (_isEmpty(user)) {
      console.log(user);
      response.json(getResponseJson("INVALID_CREDENTIALS", false));
      return;
    }

    const isCorrect = await bcrypt.compare(userPassword, user.userPassword);
    if (!isCorrect) {
      response.json(getResponseJson("INVALID_CREDENTIALS", false));
      return;
    }

    const userData = {
      userId: user.userId,
      userRole: userRole as string,
    };
    const authToken = await generateToken(userData, 1000 * 60 * 60 * 24 * 7); // 7 days validity

    // TODO: set as cookie DEPLOY AT SAME ORIGIN TO MAKE IT WORK... or maybe learn more :)
    // response.cookie("auth", authToken, {
    //   httpOnly: false, // Allow access from client-side JavaScript
    //   secure: false, // Allow sending over non-HTTPS connections (for testing)
    //   sameSite: "None", // Allow cross-site requests
    // });

    // TODO: send token also
    const detailedUserData = {
      // @ts-ignore
      ...user._doc, // TODO: Fix me
      userPassword: undefined,
      authToken,
    };
    response.json(getResponseJson(detailedUserData));
  } catch (err) {
    response.json(getResponseJson(err?.message || "INTERNAL_ERROR", false));
  }
};

const handlePostSignup = async (request, response) => {
  try {
    const { userFirstName, userLastName, userEmail, userPassword, userRole } =
      request.body;

    const hashedPassword = await bcrypt.hash(
      userPassword,
      SALT_ROUNDS_FOR_HASHING
    );

    const successfullySavedUser = await createUser({
      userFirstName: userFirstName,
      userLastName: userLastName,
      userEmail: userEmail,
      userPassword: hashedPassword,
      userRole: userRole.toLowerCase(),
    });

    response.json(getResponseJson(successfullySavedUser));
  } catch (err) {
    response.json(getResponseJson(err?.message || "INTERNAL_ERROR", false));
  }
};

const handleGetValidate = async (request, response) => {
  response.json(getResponseJson(request.userData));
};

const handleDeleteUser = async (request, response) => {};

const handlePutUser = async (request, response) => {
  try {
    const Fields = request.body;
    const userId = request.userData.userId;

    const successfullyUpdatedUser = await updateUser(Fields, userId);

    response.json(getResponseJson(successfullyUpdatedUser));
  } catch (err) {
    response.json(getResponseJson(err?.message, false));
  }
};

export {
  handleDeleteUser,
  handleGetValidate,
  handlePostLogin,
  handlePostSignup,
  handlePutUser,
};
