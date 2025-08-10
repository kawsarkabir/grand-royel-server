import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String, default: "" },
    photoURL: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    createdAt: { type: Date, default: Date.now },
});
// Add indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ uid: 1 });
export default mongoose.model("User", userSchema);
