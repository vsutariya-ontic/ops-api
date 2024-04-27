import mongoose from "mongoose";

export const itemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true,
    default: () => String(new mongoose.Types.ObjectId()),
    unique: true,
  },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  quantityLeft: { type: Number, required: false },
  timeToMake: { type: Number, required: true },
  ingredients: { type: String, required: false },
  imageUrl: {
    type: String,
    required: true,
  },
  createdTime: {
    type: Object,
    required: false,
    default: () => Date.now(),
  },
});
