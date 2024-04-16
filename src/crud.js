const { User, Item, Order, Table, Team } = require("./models.js");

const OrderStatus = {
  1: "IN_CART",
  2: "PLACED",
  3: "ACCEPTED",
  4: "COMPLETED",
};

/* User */
const createUser = async () => {};

/* Menu */
const readAllItems = async () => {};

const readItem = async () => {};

const createItem = async () => {};

const deleteItem = async () => {};

/* Order */
const readOrder = async () => {};

const createOrder = async () => {};

const updateOrder = async () => {};

/* Tables */
const readTables = async () => {};

const createTable = async () => {};

const deleteTable = async () => {};

const setDefaultTable = async () => {};

module.exports = {
  createUser,
  readAllItems,
  readItem,
  createItem,
  deleteItem,
  readOrder,
  createOrder,
  updateOrder,
  readTables,
  createTable,
  deleteTable,
  setDefaultTable,
};
