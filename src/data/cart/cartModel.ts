import mongoose from "mongoose";

export const cartSchema = new mongoose.Schema({
  cartId: {
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
    required: false,
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
  instructions: {
    type: String,
    required: false,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
});
