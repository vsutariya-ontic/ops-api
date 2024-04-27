import mongoose from "mongoose";

export const tableSchema = new mongoose.Schema({
  tableId: {
    type: String,
    required: true,
    default: () => String(new mongoose.Types.ObjectId()),
  },
  tableNo: { type: Number, required: false, unique: true },
  tableName: { type: String, required: false },
  teamId: {
    type: String,
    ref: "Team",
    required: false,
  },
});
