const { User, Item, Order, Table, Team, newOrder } = require("./models.js");

const OrderStatus = {
  1: "IN_CART",
  2: "PLACED",
  3: "ACCEPTED",
  4: "COMPLETED",
};

/* User */
const createUser = async (propsUser) => {
  const createdUser = new User(propsUser);
  const successfullySavedUser = await createdUser.save();
  return successfullySavedUser;
};

const setDefaultTable = async (userId, table) => {
  const successfullySavedUser = await findOneAndUpdate(
    {
      user_id: userId,
    },
    {
      $set: {
        default_table: table,
      },
    },
    {
      new: true,
    }
  );
  return successfullySavedUser;
};

/* Menu */
const readAllItems = async () => {
  const items = await Item.find();
  return items;
};

const readItem = async (itemId) => {
  const item = await Item.find({
    item_id: itemId,
  });
  return item;
};

const createItem = async (props) => {
  const {
    itemName,
    category,
    quantityLeft,
    timeToMake,
    ingredients,
    imageUrl,
  } = props;

  const item = new Item({
    item_name: itemName,
    category: category,
    quantity_left: quantityLeft,
    time_to_make: timeToMake,
    ingredients: ingredients,
    image_url: imageUrl,
  });

  const successfullySavedItem = await item.save();
  return successfullySavedItem;
};

const deleteItem = async (itemId) => {
  const deletedItems = await Item.deleteMany({ item_id: itemId });
  return deletedItems;
};

/* Order */
const readOrder = async (userId) => {
  const order = await newOrder.find({
    user_id: userId,
  });
  const items = order.items;
  return items;
};

const createOrder = async (propsOrder) => {
  const createdOrder = new newOrder(propsOrder);
  const successfullySavedOrder = await createdOrder.save();
  return successfullySavedOrder;
};

const updateOrder = async (propsOrder) => {
  const successfullySavedOrder = await newOrder.findOneAndUpdate(
    {
      user_id: propsOrder.userId,
    },
    propsOrder,
    {
      new: true,
      upsert: true,
    }
  );
  return successfullySavedOrder;
};

/* Tables */
const readTables = async () => {
  const tables = await Table.find();
  return tables;
};

const createTable = async (props) => {
  const { tableNo, tableName, teamId } = props;
  if (!tableNo && !tableName) {
    throw new Error("INSUFFICIENT_DATA_FOR_TABLE_CREATION");
  }
  const createdTable = new Table({
    table_no: tableNo,
    table_name: tableName,
    team_id: teamId,
  });
  const successfullySavedTable = await createdTable.save();
  return successfullySavedTable;
};

const deleteTable = async (tableId) => {
  const deletedTables = await Table.deleteMany({ table_id: tableId });
  return deletedTables;
};

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
