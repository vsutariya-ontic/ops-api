const mongoose = require("mongoose");
const teamSchema = new mongoose.Schema({
    team_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true,
    },
    team_name: { type: String, required: true },
    team_location: { type: String, required: true },
});

const tableSchema = new mongoose.Schema({
    table_no: { type: Number, required: true, unique: true },
    team_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: true,
    },
});

const userSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
        required: true,
        unique: true,
    },
    user_name: { type: String, required: true },
    user_email: { type: String, required: true, unique: true },
    user_password: { type: String, required: true },
    user_role: { type: String, required: true },
    table_no: {
        type: Number,
        type: String,
        ref: "Table",
        // required: true,
        // default: "",
    },
    team_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        required: false,
    },
});

const itemSchema = new mongoose.Schema({
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        default: () => new mongoose.Types.ObjectId(),
        unique: true,
    },
    item_name: { type: String, required: true },
    category: { type: String, required: true },
    quantity_left: { type: Number, required: true },
    time_to_make: { type: Number, required: true },
    ingredients: { type: String, required: false },
    image_url: {
        type: String,
        required: true,
    },
});

const cartItemSchema = new mongoose.Schema({
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    quantity: { type: Number, required: true },
    creation_time_date: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema({
    order_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
        required: true,
        unique: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    user_name: { type: String, required: true },
    table_no: {
        type: Number,
        ref: "Table",
        required: true,
    },
    order_date_time: { type: Date, default: Date.now },
    status: { type: String, required: true, default: "waiting" },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    quantity: { type: Number, required: true },
    instructions: { type: String, required: false },
});

const databaseName = "ops_db";
const password = "5OvYZ1W6pWw8HXJO";
const dbURI = `mongodb+srv://vsutariya:${password}@cluster-ops.0lqpr4h.mongodb.net/${databaseName}`;

mongoose.connect(dbURI);

const Team = mongoose.model("Team", teamSchema);
const Table = mongoose.model("Table", tableSchema);
const User = mongoose.model("User", userSchema);
const Item = mongoose.model("Item", itemSchema);
const CartItem = mongoose.model("CartItem", cartItemSchema);
const Order = mongoose.model("Order", orderSchema);

module.exports = {
    teamSchema,
    tableSchema,
    userSchema,
    itemSchema,
    cartItemSchema,
    orderSchema,
    Team,
    Table,
    User,
    Item,
    CartItem,
    Order,
};
