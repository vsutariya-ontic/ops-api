const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
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
} = require("../utils");

const { authMiddleware } = require("../authMIddleware");
const { readItem, readAllItems } = require("../crud");
const { readUser, createUser, updateUser } = require("./crud");

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
app.use(express.json());

// TODO: setup for the ui origin only
app.use(
  cors({
    origin: "*",
    methods: "OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    maxAge: 86400, // 86400 seconds = 24 hours
  })
);
app.use(authMiddleware);
app.post("/login", handlePostLogin);
app.post("/signup", handlePostSignup);
app.post("/validate", handlePostValidate);
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
    const user = readUser(userEmail, userRole);

    if (_isEmpty(user)) {
      response.json(getResponseJson("INVALID_CREDENTIALS", false));
    }

    const isCorrect = await bcrypt.compare(userPassword, user[0].user_password);
    if (!isCorrect) {
      response.json(getResponseJson("INVALID_CREDENTIALS", false));
    }

    const userData = {
      userId: user[0].user_id,
      userRole: userRole,
    };
    const authToken = await generateToken(userData, 1000 * 60 * 60 * 24 * 7); // 7 days validity
    // TODO: set as cookie

    response.json(getResponseJson(userData));
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
      user_first_name: userFirstName,
      user_last_name: userLastName,
      user_email: userEmail,
      user_password: hashedPassword,
      user_role: userRole.toLowerCase(),
    });

    response.json(getResponseJson(successfullySavedUser));
  } catch (err) {
    response.json(getResponseJson(err?.message || "INTERNAL_ERROR", false));
  }
};

const handleNewGetValidate = async (request, response) => {
  response.json(getResponseJson());
};

const handleNewDeleteUser = async (request, response) => {};

const handleNewPutUser = async (request, response) => {
  const newFields = request.body;
  const userId = request.userData.user_id;

  const successfullyUpdatedUser = await updateUser(newFields, userId);

  response.json(getResponseJson(successfullyUpdatedUser));
};

/* user endpoints */
app.post("/new-login", handleNewPostLogin);
app.post("/new-signup", handleNewPostSignup);
app.delete("/new-delete", handleNewDeleteUser);
app.get("/new-validate", handleNewGetValidate);
app.put("/new-update-user", handleNewPutUser);

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

const handleNewPostItem = async (request, response) => {};

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
