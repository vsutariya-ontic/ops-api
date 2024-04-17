const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { authMiddleware } = require("./authMIddleware");
const {
  handlePostLogin,
  handlePostSignup,
  handlePostValidate,
  handlePostCreateItem,
  handlePostGetItem,
  handleUploadCartItem,
  handlePostGetCartItemQuantity,
  handlePostGetCartItemList,
  handlePostGetTableList,
  handlePostGetDefaultTable,
  handlePostSetDefaultTable,
  handlePlaceOrder,
  handlePostGetOrders,
  handlePostUpdateOrderStatus,
  handlePostGetPendingOrders,
  handlePostGetPreparingOrders,
} = require("./utils");

const {
  readItem,
  readAllItems,
  readUser,
  createUser,
  updateUser,
  createItem,
} = require("./crud");

// lodash imports
const _isEmpty = require("lodash/isEmpty");
const { generateToken } = require("./utils");
const { SALT_ROUNDS_FOR_HASHING, PORT } = require("./constants");

const getResponseJson = (data, success = true) => {
  if (!data) {
    return { success: success };
  } else
    return {
      data: data,
      success: success,
    };
};

const app = express();

/* Middlewares */
app.use(express.json());
app.use(cookieParser());

// TODO: setup for the ui origin only
app.use(
  cors({
    origin: "*",
    methods: "OPTIONS",
    allowedHeaders: "Authorization, Content-type",
    maxAge: 86400, // 86400 seconds = 24 hours
    // credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(authMiddleware);

// app.post("/login", handlePostLogin);
// app.post("/signup", handlePostSignup);
// app.post("/validate", handlePostValidate);
app.post("/createItem", handlePostCreateItem);
app.post("/getItem", handlePostGetItem);

app.post("/add-cart-item", handleUploadCartItem);
app.post("/get-cart-item-quantity", handlePostGetCartItemQuantity);
app.post("/get-cart-item-list", handlePostGetCartItemList);

app.post("/get-table-list", handlePostGetTableList);
app.post("/get-default-table", handlePostGetDefaultTable);
app.post("/add-default-table", handlePostSetDefaultTable);

app.post("/add-order", handlePlaceOrder);
app.post("/get-pending-orders", handlePostGetPendingOrders);
app.post("/get-preparing-orders", handlePostGetPreparingOrders);
app.post("/get-completed-orders", handlePostGetOrders);
app.post("/update-order-status", handlePostUpdateOrderStatus);

/* version 2.0 */

/* user api call handlers */
const handleNewPostLogin = async (request, response) => {
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
      userRole: userRole,
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
      ...user._doc,
      userPassword: undefined,
      authToken,
    };
    response.json(getResponseJson(detailedUserData));
  } catch (err) {
    response.json(getResponseJson(err?.message || "INTERNAL_ERROR", false));
  }
};

const handleNewPostSignup = async (request, response) => {
  try {
    const { userFirstName, userLastName, userEmail, userPassword, userRole } =
      request.body;

    const hashedPassword = await bcrypt.hash(
      userPassword,
      SALT_ROUNDS_FOR_HASHING
    );

    const successfullySavedUser = createUser({
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

const handleNewGetValidate = async (request, response) => {
  response.json(getResponseJson(request.userData));
};

const handleNewDeleteUser = async (request, response) => {};

const handleNewPutUser = async (request, response) => {
  const newFields = request.body;
  const userId = request.userData.userId;

  const successfullyUpdatedUser = await updateUser(newFields, userId);

  response.json(getResponseJson(successfullyUpdatedUser));
};

/* user endpoints */
app.post("/login", handleNewPostLogin);
app.post("/signup", handleNewPostSignup);
app.delete("/new-delete", handleNewDeleteUser);
app.get("/validate", handleNewGetValidate);
app.put("/new-user", handleNewPutUser);

/* item api call handlers */
const handleNewGetItem = async (request, response) => {
  const itemId = request.params.id;
  if (!itemId) {
    const items = await readAllItems();
    response.json(getResponseJson(items));
  } else {
    const item = await readItem(itemId);
    if (item) {
      response.json(getResponseJson(item));
    } else response.json(getResponseJson());
  }
};

const handleNewPostItem = async (request, response) => {
  try {
    const successfullySavedItem = createItem(request.body);
    response.json(getResponseJson(successfullySavedItem));
  } catch (err) {
    response.json(getResponseJson("ITEM_CREATION_FAILED", false));
  }
};

const handleNewDeleteItem = async (request, response) => {};

/* item endpoints */
app.get("/new-item", handleNewGetItem);
app.post("/new-item", handleNewPostItem);
app.delete("/new-item", handleNewDeleteItem);

/* order api call handlers */
const handleNewPostOrder = async (request, response) => {};

const handleNewGetOrder = async (request, response) => {};

const handleNewDeleteOrder = async (request, response) => {};

/* order endpoints */
app.get("/new-order", handleNewGetOrder);
app.post("/new-order", handleNewPostOrder);
app.delete("/new-order", handleNewDeleteOrder);

/* table api call handlers */
const handleNewGetTable = async (request, response) => {};

const handleNewPostTable = async (request, response) => {};

const handleNewDeleteTable = async (request, response) => {};

/* table endpoints */
app.get("/new-table", handleNewGetTable);
app.post("/new-table", handleNewPostTable);
app.delete("/new-table", handleNewDeleteTable);

app.listen(PORT, () => {
  console.log(`Listening at ${PORT} port`);
});
