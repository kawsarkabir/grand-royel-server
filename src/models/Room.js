const roomSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  rating: Number,
  reviews: Number,
  amenities: [String],
  location: String,
  isAvailable: Boolean,
});
const Room = mongoose.model("Room", roomSchema);
export default Room;
