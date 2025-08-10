import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: string;
  createdAt: Date;
}

const userSchema = new Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String, default: "" },
  photoURL: { type: String, default: "" },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", userSchema);
