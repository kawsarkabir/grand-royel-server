import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  userEmail: string;
  roomId: mongoose.Types.ObjectId;
  date: string;
  roomName: string;
  roomPrice: number;
  roomImage: string;
}

const BookingSchema: Schema = new Schema(
  {
    userEmail: { type: String, required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    date: { type: String, required: true },
    roomName: { type: String, required: true },
    roomPrice: { type: Number, required: true },
    roomImage: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
