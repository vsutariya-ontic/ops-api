const { User, Item, Order, Table, Team, newOrder } = require("./models.js");

/* User */

const readUserById = async (userId) => {
  const user = await User.find({
    userId: userId,
  });
  return user?.[0];
};

const readUser = async (userEmail, userRole) => {
  const user = await User.find({
    userEmail: userEmail,
    userRole: userRole.toLowerCase(),
  });
  console.log(user?.[0], "data");
  return user?.[0];
};

const createUser = async (propsUser) => {
  const createdUser = new User(propsUser);
  const successfullySavedUser = await createdUser.save();
  return successfullySavedUser;
};

const updateUser = async (newFields, userId) => {
  const successfullySavedUser = await findOneAndUpdate(
    {
      userId: userId,
    },
    {
      $set: {
        ...newFields,
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
    itemId: itemId,
  });
  return item[0];
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
    itemName: itemName,
    category: category,
    quantityLeft: quantityLeft,
    timeToMake: timeToMake,
    ingredients: ingredients,
    imageUrl: imageUrl,
  });

  const successfullySavedItem = await item.save();
  return successfullySavedItem;
};

const deleteItem = async (itemId) => {
  const deletedItems = await Item.deleteMany({ itemId: itemId });
  return deletedItems;
};

/* Order */
const readOrder = async (userId) => {
  const order = await newOrder.find({
    userId: userId,
  });
  const items = order?.[0].items;
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
      userId: propsOrder.userId,
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
    tableNo: tableNo,
    tableName: tableName,
    teamId: teamId,
  });
  const successfullySavedTable = await createdTable.save();
  return successfullySavedTable;
};

const deleteTable = async (tableId) => {
  const deletedTables = await Table.deleteMany({ tableId: tableId });
  return deletedTables;
};

module.exports = {
  readUserById,
  readUser,
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
  updateUser,
};
