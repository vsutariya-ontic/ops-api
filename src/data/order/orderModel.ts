import mongoose from "mongoose";
import { OrderStatus } from "../../constants/constants";

export const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    default: () => String(new mongoose.Types.ObjectId()),
  },
  userId: {
    type: String,
    required: true,
  },
  table: {
    type: Object,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: OrderStatus.PLACED,
  },
  createdTime: {
    type: Object,
    required: false,
    default: () => Date.now(),
  },
  instructions: {
    type: String,
    required: false,
  },
});
