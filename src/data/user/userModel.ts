import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: () => String(new mongoose.Types.ObjectId()),
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
    type: String,
    required: false,
  },
});
