import mongoose, { Schema } from "mongoose";
const ReviewSchema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    photoURL: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
}, { timestamps: true });
export default mongoose.model("Review", ReviewSchema);
