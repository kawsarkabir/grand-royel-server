import mongoose, { Schema } from "mongoose";
const BookingSchema = new Schema({
    userEmail: { type: String, required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    date: { type: String, required: true },
    roomName: { type: String, required: true },
    roomPrice: { type: Number, required: true },
    roomImage: { type: String, required: true },
}, { timestamps: true });
export default mongoose.model("Booking", BookingSchema);
