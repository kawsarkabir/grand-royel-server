import mongoose, { Document, Schema, Types } from "mongoose";

export interface IReview extends Document {
  roomId: Types.ObjectId;
  username: string;
  photoURL: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
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
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", ReviewSchema);
