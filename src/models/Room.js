import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  images: [String],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  amenities: [String],
  guests: Number,
  beds: Number,
  bathrooms: Number,
  host: {
    name: String,
    joined: String,
    superhost: Boolean,
    avatar: String,
  },
  location: String,
  isAvailable: { type: Boolean, default: true },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
