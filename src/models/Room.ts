import mongoose, { Document, Schema } from "mongoose";

export interface IRoom extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  available: boolean;
  rating: number;
  totalReviews: number;
  guests: number;
  beds: number;
  bathrooms: number;
  location: string;
  host: {
    name: string;
    joined: string;
    superhost: boolean;
    avatar: string;
  };
}

const RoomSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    available: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    guests: { type: Number, required: true },
    beds: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    location: { type: String, required: true },
    host: {
      name: { type: String, required: true },
      joined: { type: String, required: true },
      superhost: { type: Boolean, required: true },
      avatar: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>("Room", RoomSchema);
