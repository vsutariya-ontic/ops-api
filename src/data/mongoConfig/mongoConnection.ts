import { configDotenv } from "dotenv";
import mongoose from "mongoose";
import { cartSchema } from "../cart/cartModel";
import { itemSchema } from "../item/itemModel";
import { orderSchema } from "../order/orderModel";
import { tableSchema } from "../table/tableModel";
import { userSchema } from "../user/userModel";

configDotenv();
export const dbURI = `mongodb+srv://vsutariya:${process.env.MONGO_DB_PASSWORD}@cluster-ops.0lqpr4h.mongodb.net/${process.env.MONGO_DB_NAME}`;

export const connectToMongoDB = async () => {
  console.log("db connected");
  return mongoose.connect(dbURI);
};

export const disconnectFromMongoDB = async () => {
  console.log("db disconnected");
  // await mongoose.disconnect();
};

export const Item = mongoose.model("Item", itemSchema);
export const Table = mongoose.model("Table", tableSchema);
export const User = mongoose.model("User", userSchema);
export const Order = mongoose.model("Order", orderSchema);
export const Cart = mongoose.model("Cart", cartSchema);
