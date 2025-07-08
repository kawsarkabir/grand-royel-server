const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());

// Dummy middleware (replace with Firebase auth later)
const verifyToken = (req, res, next) => {
  req.user = { email: "testuser@example.com" }; // Replace later with real auth
  next();
};

// ====== SCHEMAS & MODELS ======
const RoomSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: String,
  available: Boolean,
});
const Room = mongoose.model("Room", RoomSchema);

const BookingSchema = new mongoose.Schema({
  userEmail: String,
  roomId: String,
  date: String,
});
const Booking = mongoose.model("Booking", BookingSchema);

// ====== DATABASE ======
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ====== ROUTES ======
app.get("/api/rooms", async (req, res) => {
  try {
    const rooms = await Room.find({});
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/rooms/:id", async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ error: "Room not found" });
  res.json(room);
});

app.post("/api/bookings", verifyToken, async (req, res) => {
  const { roomId, date } = req.body;

  try {
    const newBooking = await Booking.create({
      userEmail: req.user.email,
      roomId,
      date,
    });

    res.send({ message: "Booking confirmed", booking: newBooking });
  } catch (err) {
    res.status(500).send({ error: "Failed to book room" });
  }
});

app.get("/api/my-bookings", verifyToken, async (req, res) => {
  const bookings = await Booking.find({ userEmail: req.user.email });
  res.send(bookings);
  console.log(bookings);
});

// ====== START SERVER ======
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
