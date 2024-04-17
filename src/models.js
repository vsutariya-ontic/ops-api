const mongoose = require("mongoose");
const teamSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  teamName: { type: String, required: true },
  teamLocation: { type: String, required: true },
});

const tableSchema = new mongoose.Schema({
  tableId: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  tableNo: { type: Number, required: false, unique: true },
  tableName: { type: String, required: false },
  teamId: {
    type: String,
    ref: "Team",
    required: false,
  },
});

const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    required: true,
    unique: true,
  },
  userFirstName: { type: String, required: false },
  userLastName: { type: String, required: false },
  userEmail: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true },
  userRole: { type: String, required: true },
  defaultTable: { type: Object, required: false },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: false,
  },
});

const itemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
    unique: true,
  },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  quantityLeft: { type: Number, required: true },
  timeToMake: { type: Number, required: true },
  ingredients: { type: String, required: false },
  imageUrl: {
    type: String,
    required: true,
  },
});

const cartItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  quantity: { type: Number, required: true },
  creationTimeDate: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: { type: String, required: true },
  tableNo: {
    type: Number,
    ref: "Table",
    required: true,
  },
  orderDateTime: { type: Date, default: Date.now },
  status: { type: String, required: true, default: "waiting" },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  quantity: { type: Number, required: true },
  instructions: { type: String, required: false },
});

const newOrderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    default: () => new mongoose.Types.ObjectId(),
  },
  userId: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdTime: {
    type: Object,
    required: false,
  },
});

const databaseName = "opsDatabase";
const password = "5OvYZ1W6pWw8HXJO";
const dbURI = `mongodb+srv://vsutariya:${password}@cluster-ops.0lqpr4h.mongodb.net/${databaseName}`;

mongoose.connect(dbURI);

const Team = mongoose.model("Team", teamSchema);
const Table = mongoose.model("Table", tableSchema);
const User = mongoose.model("User", userSchema);
const Item = mongoose.model("Item", itemSchema);
const CartItem = mongoose.model("CartItem", cartItemSchema);
const Order = mongoose.model("Order", orderSchema);
const newOrder = mongoose.model("NewOrder", newOrderSchema);

module.exports = {
  teamSchema,
  tableSchema,
  userSchema,
  itemSchema,
  cartItemSchema,
  orderSchema,
  newOrderSchema,
  Team,
  Table,
  User,
  Item,
  CartItem,
  Order,
  newOrder,
};
